// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getUserDB, updateUserDB } from "@/lib/actions";
// import { useEffect, useState } from "react";

// export default function SettingsTab() {
//   const [userDB, setUserDB] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   // Local states for the form fields
//   const [maxQuestions, setMaxQuestions] = useState<number | string>("");
//   const [questionPrice, setQuestionPrice] = useState<number | string>("");
//   const [maxQuestionLines, setMaxQuestionLines] = useState<number | string>("");

//   const handleUserDB = async () => {
//     try {
//       const res = await getUserDB(); // Get serialized user data
//       setUserDB(res);

//       // Initialize local states with fetched data
//       setMaxQuestions(res?.maxQuestions || "");
//       setQuestionPrice(res?.questionPrice || "");
//       setMaxQuestionLines(res?.maxQuestionLines || "");
//     } catch (error) {
//       console.log(error || "Failed to fetch user data");
//     }
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData(e.target);

//     try {
//       // Example payload structure
//       await updateUserDB(formData);
//       // Call the API to save changes (replace with your API call)

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleUserDB();
//   }, []);

//   return (
//     <div>
//       <form className="grid gap-4" onSubmit={handleSubmit}>
//         <div className="grid gap-3">
//           <Label htmlFor="maxQuestions">What's the maximum number of questions do you want to have in queue?</Label>
//           <Input
//             value={maxQuestions}
//             onChange={(e) => setMaxQuestions(e.target.value)}
//             id="maxQuestions"
//             name="maxQuestions"
//             type="number"
//             placeholder="100"
//             required
//             min="2"
//           />
//         </div>
//         <div className="grid gap-3">
//           <Label htmlFor="questionPrice">What do you want the price to be for asking you a question?</Label>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
//             <Input
//               id="questionPrice"
//               value={questionPrice}
//               onChange={(e) => setQuestionPrice(e.target.value)}
//               name="questionPrice"
//               type="number"
//               placeholder="50"
//               min="0"
//               required
//               className="pl-8"
//             />
//           </div>
//         </div>
//         <div className="grid gap-3">
//           <Label htmlFor="maxQuestionLines">What should be the maximum number of lines for the asked questions?</Label>
//           <Input
//             value={maxQuestionLines}
//             onChange={(e) => setMaxQuestionLines(e.target.value)}
//             id="maxQuestionLines"
//             name="maxQuestionLines"
//             type="number"
//             placeholder="10"
//             min="1"
//             required
//           />
//         </div>
//         <Button type="submit" disabled={loading}>
//           {loading ? "Saving..." : "Save changes"}
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserDB, updateUserDB } from "@/lib/actions";
import { useEffect, useState } from "react";

export default function SettingsTab() {
  const [userDB, setUserDB] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  // Local states for the form fields
  const [maxQuestions, setMaxQuestions] = useState<number | string>("");
  const [questionPrice, setQuestionPrice] = useState<number | string>("");
  const [maxQuestionLines, setMaxQuestionLines] = useState<number | string>("");

  const [isChanged, setIsChanged] = useState(false);

  const handleUserDB = async () => {
    try {
      const res = await getUserDB(); // Get serialized user data
      setUserDB(res);

      // Initialize local states with fetched data
      setMaxQuestions(res?.maxQuestions || "");
      setQuestionPrice(res?.questionPrice || "");
      setMaxQuestionLines(res?.maxQuestionLines || "");
      setIsFetched(true); // Data is successfully fetched
    } catch (error) {
      console.log(error || "Failed to fetch user data");
    }
  };

  // Compare form fields with userDB to detect changes
  const checkChanges = () => {
    if (
      userDB &&
      (String(userDB.maxQuestions) !== String(maxQuestions) ||
        String(userDB.questionPrice) !== String(questionPrice) ||
        String(userDB.maxQuestionLines) !== String(maxQuestionLines))
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      await updateUserDB(formData);
      setIsChanged(false); // Reset change detection after successful save
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Run the `checkChanges` function whenever local states change
  useEffect(() => {
    checkChanges();
  }, [maxQuestions, questionPrice, maxQuestionLines]);

  useEffect(() => {
    handleUserDB();
  }, []);

  return (
    <div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <Label htmlFor="maxQuestions">What's the maximum number of questions do you want to have in queue?</Label>
          <Input
            value={maxQuestions}
            onChange={(e) => setMaxQuestions(e.target.value)}
            id="maxQuestions"
            name="maxQuestions"
            type="number"
            placeholder="100"
            required
            min="2"
            disabled={!isFetched} // Disable input until data is fetched
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="questionPrice">What do you want the price to be for asking you a question?</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
            <Input
              id="questionPrice"
              value={questionPrice}
              onChange={(e) => setQuestionPrice(e.target.value)}
              name="questionPrice"
              type="number"
              placeholder="50"
              min="0"
              required
              className="pl-8"
              disabled={!isFetched} // Disable input until data is fetched
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="maxQuestionLines">What should be the maximum number of lines for the asked questions?</Label>
          <Input
            value={maxQuestionLines}
            onChange={(e) => setMaxQuestionLines(e.target.value)}
            id="maxQuestionLines"
            name="maxQuestionLines"
            type="number"
            placeholder="10"
            min="1"
            required
            disabled={!isFetched} // Disable input until data is fetched
          />
        </div>
        <Button type="submit" disabled={loading || !isChanged}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
