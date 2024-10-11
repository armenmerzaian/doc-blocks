'use client'

import { Button } from "@/components/ui/button";
import { useSideNavStore } from "@/stores/sideNav-store";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export const NavMenuButton = () => {

    const {isSignedIn} = useUser();
    const pathname = usePathname();
    const { toggleNav } = useSideNavStore(); 

    if(isSignedIn && pathname === '/dashboard') {
        return (
            <Button asChild onClick={()=>(toggleNav())} className="cursor-pointer">
                <div>
                    Menu
                </div>
            </Button>
        )
    }
  
}
