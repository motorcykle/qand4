

import { db } from "@/db";
import { questionsTable, usersTable } from "@/db/schema";
import stripe from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    return new Response("webhook error", { status: 400 });
  }

  switch (event.type) {
    case "account.updated": {
      const account = event.data.object;
      console.log("hereeeeee", account.capabilities?.transfers);
      await db
        .update(usersTable)
        .set({ 
          stripe_connected_linked: 
            account.capabilities?.transfers === "pending" || 
            account.capabilities?.transfers === "inactive"
          ? false : true 
        })
        .where(eq(usersTable.connected_account_id, account.id));
      break;
    }

    case "checkout.session.completed": {
      const session = event.data.object;
      const metadata = session.metadata!;
      console.log(session)

      // You can use this section for other business logic if necessary
      console.log("Checkout session completed with link: ", metadata);
      const res = await db.insert(questionsTable).values({
        question: metadata.question as string,
        fromEmail: metadata.fromEmail as string,
        to: metadata.to as string,  // Link to user who created the question
      });

      console.log(res)

      break;
    }

    default: {
      console.log("Unhandled event type: ", event.type);
    }
  }

  return new Response(null, { status: 200 });
}
