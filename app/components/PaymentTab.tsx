import { CreateStripeAccoutnLink, GetStripeDashboardLink, ReadyForPayment } from "@/lib/actions"
import { currentUser } from "@clerk/nextjs/server"
import { Submitbutton } from "./SubmitButton"

export default async function PaymentTab () {
  const user = await currentUser()
  const stripeConnected = await ReadyForPayment(user?.id!)

  return <div>
    {!stripeConnected ? (
      <form action={CreateStripeAccoutnLink}>
        <Submitbutton title="Link your Account to stripe" />
      </form>
    ) : 
      <form action={GetStripeDashboardLink}>
        <Submitbutton title="View Dashboard" />
      </form>
    }
  </div>
}