import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import QuestionForm from "@/app/components/QuestionForm"
import { ReadyForPayment } from "@/lib/actions"


export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {

  const username = (await params).username;

  const [response] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  const questionsAvailable = 6
  const maxQuestions = 6 // disable button
  const profileUser = response ? await (await clerkClient()).users.getUser(response?.id) : redirect("/")
  const stripeConnected = await ReadyForPayment(profileUser.id)

  return <main>
    <section className="max-w-6xl mx-auto py-5 px-2 text-center flex items-center justify-center flex-col">
      <Card className="max-w-xs w-full">
        <CardHeader>
          <Image className="mx-auto rounded-full" width={100} height={100} src={profileUser?.hasImage ? profileUser?.imageUrl : `https://ui-avatars.com/api/?name=${profileUser?.firstName}+${profileUser?.lastName}`} alt="profile pic" />
          <CardTitle className="text-2xl">@{profileUser?.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger disabled={!stripeConnected} asChild>
              <Button className="w-full animate-pulse">
                  Ask @{profileUser?.username} your question ${response.questionPrice}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <QuestionForm profileId={profileUser.id!} />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </section>
  </main>
}