import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Playfair_Display } from 'next/font/google'
import { SignInButton, SignUpButton } from "@clerk/nextjs";


const inter = Playfair_Display({
  subsets: ['latin'],
  weight: '800', // Add this line to specify the bold weight
})

export default function Home() {
  return (
    <main className=" my-auto">
      <section className="max-w-6xl mx-auto py-5 px-2 text-center space-y-8 flex items-center justify-center flex-col">
        {/* <Image alt="art" src={"/art.jpg"} width={100} height={100} objectFit={"contain"} className=" animate-pulse rotate-45" /> */}
        {/* <h1 className={" text-9xl font-semibold"}>?=$</h1> */}

        <div className="relative rotate-12">
          <Image 
            alt="art" 
            src="/art.jpg" 
            layout="fill"  // Use 'fill' to make the image cover the entire container
            objectFit="cover" // Ensures the image covers the space without distortion
            className="absolute top-0 left-0 z-0 animate-pulse"
          />
          <h1 className={inter.className + " text-9xl font-semibold relative z-10 p-2"}>?=$</h1>
        </div>

        <p className={inter.className + " text-4xl md:text-8xl font-semibold "}>Answer Questions, <br /> Earn Instantly.</p>

        <section className="mx-auto text-center space-y-2 ">
          <p className="text-md md:text-xl text-foreground max-w-3xl mx-auto">
          Engage with your fans, build deeper connections, and get paid to share your knowledge. Join the platform that makes every question count.
          </p>

          <p className="text-xs max-w-xl mx-auto text-muted-foreground">
          Sign up, share your unique link, and start earning money every time a fan asks you a question. It’s simple—no subscriptions or long commitments, just real-time payments for valuable insights.
          </p>

          
        </section>

        <section className="flex items-center flex-col justify-center gap-2 ">
          <SignUpButton>
            <Button size={"lg"}>Let the questions in!</Button>
          </SignUpButton>
          
          <SignInButton>
            <Button variant={"ghost"} size={"lg"}> <span className="underline text-muted-foreground text-xs">I have an account</span></Button>
          </SignInButton>
        </section>
        
      </section>
    </main>
  );
}
