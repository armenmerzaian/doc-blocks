import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";


export default async function HomePage() {
  
  const user = await currentUser();

  return (
    <div className="w-full px-4 flex-col justify-center align-center py-36">
      <h1 className="text-center text-6xl mb-16">Collections</h1>

      <div className="flex justify-center">
        {user ?
        <Button asChild className="">
          <Link href="/dashboard"> To Dashboard</Link>
        </Button>
        : null}
      </div>
    </div>
  );
}
