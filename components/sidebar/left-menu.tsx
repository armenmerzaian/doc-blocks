// app/components/LeftMenu.tsx
'use client'

import { Button } from "@/components/ui/button";
import { useSideNavStore } from "@/stores/sideNav-store";

const LeftMenu: React.FC = () => {

  const { isNavOpen } = useSideNavStore();

  return (
    <div
      className={`${
        !isNavOpen ? "hidden" : "block"
      } w-full h-[calc(100vh-5rem)] drop-shadow-lg bg-black text-white max-w-xs`}
    >
      <nav className="p-4">
        <ul className="flex flex-col justify-center items-center gap-6">
          <li>
            <Button variant="link" className="text-inherit">
              Button 1
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-inherit">
              Button 2
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-inherit">
              Button 2
            </Button>
          </li>
          <li>
            <Button variant="link" className="text-inherit">
              Button 1
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeftMenu;
