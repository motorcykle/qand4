import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReadyForPayment } from "@/lib/actions"
import { currentUser } from "@clerk/nextjs/server"
import PaymentTab from "../components/PaymentTab"
import { questionsTable } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { db } from "@/db"
import SettingsTab from "../components/SettingsTab"
import QuestionsTab from "../components/QuestionsTab"

export default async function page () {
  const user = await currentUser()
  const stripeConnected = await ReadyForPayment(user?.id!)

  return <main>
    <section className="max-w-6xl mx-auto py-5 px-2 text-center flex items-center justify-center flex-col">
      <Tabs defaultValue={stripeConnected ? "questions" : "payment"} className="w-[400px]">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
          {stripeConnected ? <QuestionsTab /> : "set up stripe payments"}
        </TabsContent>
        <TabsContent value="payment">
          <PaymentTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </section>
  </main>
}