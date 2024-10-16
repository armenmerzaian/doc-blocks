// app/components/TopHeader.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { NavMenuButton } from "./nav-menu-button";
import { NAV_BAR_HEIGHT } from "@/app/lib/constants/constants";


const TopHeader: React.FC = async () => {


  return (
    <header className={`w-full px-4 bg-white rounded-b-md shadow`} style={{height: NAV_BAR_HEIGHT}}>
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