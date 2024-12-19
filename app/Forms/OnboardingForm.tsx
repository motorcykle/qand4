// "use client"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Link, Loader2 } from 'lucide-react'
// import { SubmitOnboarding } from '@/lib/actions'
// import { useFormStatus } from "react-dom"

// export default function OnboardingForm () {
//   const { pending } = useFormStatus();

//   return (
//     <form className="grid gap-4" action={SubmitOnboarding}>
//       <div className="grid gap-3">
//         <Label htmlFor="maxQuestions">What's the maximum number of questions do you want to have in queue?</Label>
//         <Input
//           id="maxQuestions"
//           name='maxQuestions'
//           type="number"
//           placeholder="100"
//           required
//           min={"2"}
//         />
//       </div>
//       <div className="grid gap-3">
//         <Label htmlFor="questionsPrice">What do you want the price to be for asking you a question?</Label>
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//           <Input
//             id="questionsPrice"
//             name="questionsPrice"
//             type="number"
//             placeholder="50"
//             min="0"
//             required
//             className="pl-8"
//           />
//         </div>
//       </div>
//       <div className="grid gap-3">
//         <Label htmlFor="maxQuestionLines">What should be the maximum number of lines for the asked questions?</Label>
//         <Input
//           id="maxQuestionLines"
//           name='maxQuestionLines'
//           type="number"
//           placeholder="10"
//           min="1"
//           required
//         />
//       </div>

//       {pending ? (
//         <Button disabled>
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           Please Wait
//         </Button>
//       ) : (
//         <Button  className="w-full" type="submit">Let's gooooo!</Button>
//       )}

//     </form>
//   )
// }

"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SubmitOnboarding } from "@/lib/actions";
import { useState } from "react";

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    try {
      await SubmitOnboarding(formData);
    } catch (error) {
      console.error("Submission error:", error);
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="maxQuestions">What's the maximum number of questions do you want to have in queue?</Label>
        <Input
          id="maxQuestions"
          name="maxQuestions"
          type="number"
          placeholder="100"
          required
          min="2"
        />
      </div>    
      <div className="grid gap-3">
        <Label htmlFor="questionPrice">What do you want the price to be for asking you a question?</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
          <Input
            id="questionPrice"
            name="questionPrice"
            type="number"
            placeholder="50"
            min="0"
            required
            className="pl-8"
          />
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="maxQuestionLines">What should be the maximum number of lines for the asked questions?</Label>
        <Input
          id="maxQuestionLines"
          name="maxQuestionLines"
          type="number"
          placeholder="10"
          min="1"
          required
        />
      </div>

      {loading ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          Let's gooooo!
        </Button>
      )}
    </form>
  );
}
