"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubmitAnswer } from "@/lib/actions"



export default function QuestionItem ({ question, setRefetch }: { question: any, setRefetch: any }) {
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    try {
      await SubmitAnswer(formData, question);
      setLoading(false);
      setRefetch(true)
    } catch (error) {
      console.error("Submission error:", error);
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Card className="">
          <CardHeader className="text-left">
            <CardTitle>{question.question}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">date</CardDescription>
          </CardHeader>
        </Card>

      </PopoverTrigger>

      <PopoverContent>
        {/* <div className="p-6">
          <p className="text-xs text-muted-foreground">{item.question}</p>
        </div> */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="answer">What's your answer?</Label>
            <Input
              type="text"
              id="answer"
              name='answer'
              required
            />
          </div>
          <Button disabled={loading} type="submit">Submit</Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}