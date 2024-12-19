import { Button } from "@/components/ui/button";
import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Header () {
  const user = await currentUser();

  return <header className="">
    <nav className="mx-auto max-w-6xl py-5 px-2 items-center justify-center grid grid-cols-3 gap-2.5">
      <div className="bg-red-600"></div>
      <div className="text-center">
        <Link href={user ? "/dashboard" : "/"} className="animate-pulse text-3xl tracking-tighter italic font-semibold">qan4?</Link>
      </div>
      <div className="flex items-center justify-end">
        <SignedIn>
          <div className="flex justify-center items-center gap-2">
            <SignOutButton><Button className="">Sign out</Button></SignOutButton>
            <Button size={"icon"}>
              <UserButton />
            </Button>
          </div>
        </SignedIn>
      </div>
    </nav>
  </header>
}