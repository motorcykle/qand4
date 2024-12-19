"use server"

import { db } from "@/db"
import { questionsTable, usersTable } from "@/db/schema"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { eq, sql } from "drizzle-orm"
import { redirect } from "next/navigation"
import stripe from "./stripe"
import { profile } from "console"
import { uuid } from "drizzle-orm/pg-core"
import { NextResponse } from "next/server"
import { Resend } from 'resend';
import { EmailTemplate } from "@/app/components/email-template"

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SubmitOnboarding (formData: FormData) {
  const user = await currentUser()

  try {
    if (!user) throw new Error("No user logged in!")

    const account = await stripe.accounts.create({
      type: 'express',
      email: user.emailAddresses[0].emailAddress as string,
      // controller: {
      //   fees: {
      //     payer: 'application',
      //   },
      //   losses: {
      //     payments: 'application',
      //   },
      //   stripe_dashboard: {
      //     type: 'express',
      //   },
      // },
      capabilities: {
        card_payments: { requested: true }, // Request capabilities for card payments
        transfers: { requested: true }, // Request capabilities for transfers
      },
    });

    const res = await db.insert(usersTable).values({
      id: user.id,
      username: user.username!,
      questionPrice: Number(formData.get("questionPrice") || 0),
      maxQuestions: Number(formData.get("maxQuestions") || 1),
      connected_account_id: account?.id,
      maxQuestionLines: Number(formData.get("maxQuestionLines") || 1)
    })

    if (res) {
      const onboarded = await (await clerkClient()).users.updateUser(user.id, {
        publicMetadata: { onboardingComplete: true },
      });

      // if (onboarded) {
      //   redirect("/dashboard")
      // }
    }

  } catch (error) {
    console.log(error)
    return redirect("/onboarding")
  }

  return redirect("/dashboard")
}

export async function SubmitQuestion (formData: FormData, profileId: string) {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, profileId));

    if (!user) throw new Error("User not found!");
    
    const questionsCountResult = await db
      .select({
        count: sql<number>`count(*)`
      })
      .from(questionsTable)
      .where(eq(questionsTable.to, profileId));
    
    const numOfQuestions = questionsCountResult[0]?.count || 0;
    
    if (numOfQuestions >= user.maxQuestions) {
      throw new Error("Too many questions!");
    }
    const question = formData.get("question");

    if (question && String(question).length / 70 > user.maxQuestionLines) {
      throw new Error("Question too long!");
    }
  
    const session = await stripe.checkout.sessions.create({
      mode: "payment",  // Ensure this value is correct and required by the API you're using
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round((user?.questionPrice as number) * 100),
            product_data: {
              name: "Assessing service",
              description: "You will be assessed by " + user?.username, // Provide fallback
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round((user?.questionPrice as number) * 100 * 0.1),
        transfer_data: {
          destination: user?.connected_account_id ?? '', // Ensure a valid string is provided
        },
        on_behalf_of: user?.connected_account_id ?? '',  // Provide fallback for `on_behalf_of`
      },
      metadata: {
        question: formData.get("question") as string,
        fromEmail: formData.get("email") as string,
        to: profileId,
      },
      success_url:
        process.env.NODE_ENV === "development"
          ? "https://6c83-83-188-244-183.ngrok-free.app"
          : "https:/qand4.vercel.app/payment/success",
      cancel_url:
        process.env.NODE_ENV === "development"
          ? "https://6c83-83-188-244-183.ngrok-free.app"
          : "https://qand4.vercel.app/payment/cancel",
    });

    return (session.url as string);

    // or this we do through stripe webhook!!!!!!!!
    // if (session.status === "complete") {
    //   const res = await db.insert(questionsTable).values({
    //     // id: String(uuid()),  // Generate a unique ID for the question
    //     question: formData.get("question") as string,
    //     fromEmail: formData.get("email") as string,
    //     to: profileId,
    //   });

      
    // }
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function ReadyForPayment (id: string) {
  try {
    const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return res[0].stripe_connected_linked
  } catch (error) {
    return error
  }
}

export async function CreateStripeAccoutnLink() {
  const user = await currentUser()

  if (!user) {
    throw new Error();
  }

  const res = await db.select().from(usersTable).where(eq(usersTable.id, user.id));

  const accountLink = await stripe.accountLinks.create({
    account: res[0]?.connected_account_id as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? `https://6c83-83-188-244-183.ngrok-free.app/dashboard`
        : `https://qand4.vercel.app/dashboard`,
    return_url:
      process.env.NODE_ENV === "development"
        ? `https://6c83-83-188-244-183.ngrok-free.app/dashboard`
        : `https://qand4.vercel.app/return/${res[0]?.connected_account_id}`,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const user = await currentUser()
  
  if (!user) {
    throw new Error();
  }

  const res = await db.select().from(usersTable).where(eq(usersTable.id, user.id));

  const loginLink = await stripe.accounts.createLoginLink(
    res[0]?.connected_account_id as string
  );

  return redirect(loginLink.url);
}

export async function getUserDB() {
  const userId = (await currentUser())?.id;
  if (!userId) throw new Error("No user logged in!");

  const result = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (result.length === 0) throw new Error("User not found");

  // Serialize the response by picking only the needed fields
  return {
    maxQuestions: result[0]?.maxQuestions || 0,
    questionPrice: result[0]?.questionPrice || 0,
    maxQuestionLines: result[0]?.maxQuestionLines || 0,
  };
}

export async function updateUserDB (formData: FormData) {
  const userId = (await currentUser())?.id
  try {
    if (!userId) throw new Error('No user logged in!')
    const res = await db.update(usersTable).set({
      maxQuestionLines: Number(formData.get("maxQuestionLines")),
      maxQuestions: Number(formData.get("maxQuestions")),
      questionPrice: Number(formData.get("questionPrice")),
    }).where(eq(usersTable.id, userId));
    return { status: "success"}
  } catch (error) {
    return error
  }
}

export async function SubmitAnswer (formData: FormData, question: any) {
  const user = (await currentUser())
  const answer = String(formData.get("answer"))
  try {
    if (!user || !question || !answer) throw new Error('No user logged in!')

    // email answer to fromEmail
    const { data, error } = await resend.emails.send({
      from: 'qand4 <onboarding@resend.dev>',
      to: [question.fromEmail],
      subject: 'QAND4 answer arrived!',
      react: EmailTemplate({ creator: user.username!, answer: answer, question: question.question}),
    });
    // delete question from question db

    if (data) {
      await db.delete(questionsTable).where(eq(questionsTable.id, question.id));
      return { status: "success"}
    }
  } catch (error) {
    return error
  }
}

interface Question {
  id: string;
  question: string;
  to: string;
  fromEmail: string;
}

export async function fetchQuestions(): Promise<Question[]> {
  const user = await currentUser();

  if (!user) {
    console.error("No user logged in!");
    return [];
  }

  try {
    const questions = await db
      .select()
      .from(questionsTable)
      .where(eq(questionsTable.to, user.id));

    return questions as Question[]; // Ensure it matches the `Question` type
  } catch (error) {
    console.error("Error fetching questions:", error);
    return []; // Return an empty array if there's an error
  }
}