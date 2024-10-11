// app/components/TopHeader.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { NavMenuButton } from "./NavMenuButton";


const TopHeader: React.FC = async () => {


  return (
    <header className="w-full px-4 h-20 bg-white rounded-b-md drop-shadow-lg">
      <div className="flex items-center justify-between h-full px-4 py-2">
        
        <NavMenuButton />
        
        <Link href="/">Home</Link>

        <div className="">
          <SignedOut>
            <Button asChild>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
              <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;