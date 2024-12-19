"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitQuestion } from "@/lib/actions";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuestionForm ({ profileId }: { profileId: string}) {
  const [loading, setLoading] = useState(false); 
  const router = useRouter()

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    try {
      const res = await SubmitQuestion(formData, profileId);
      router.push(res as string);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return <div>
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="question">What's the question you'd like to ask?</Label>
        <Textarea
          id="question"
          name='question'
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="email">What's your email?</Label>
        <Input
          type="email"
          id="email"
          name='email'
          required
        />
      </div>
      <Button disabled={loading} type="submit">Submit</Button>
    </form>
  </div>
}