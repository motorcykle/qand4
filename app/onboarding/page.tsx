
import { Playfair_Display } from 'next/font/google'
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
import { Link } from 'lucide-react'
import { SubmitOnboarding } from '@/lib/actions'
import OnboardingForm from '../Forms/OnboardingForm'

const inter = Playfair_Display({
  subsets: ['latin'],
  weight: '800', // Add this line to specify the bold weight
})

export default function page () {
  return <main className="">
    <section className="max-w-6xl mx-auto py-5 px-2 space-y-8">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to qan4! 🤠</CardTitle>
          <CardDescription>
            Please answer a few questions so we get to know how you'd like things to run around here, cowboy!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </section>
  </main>
}