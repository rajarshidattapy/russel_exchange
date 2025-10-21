import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="space-y-8 flex flex-col items-center justify-center bg-amber-50 border-4 border-amber-800 rounded-lg p-16">
      <Image src="/package.svg" width="200" height="200" alt="Package" />
      <h2 className="text-2xl font-bold font-serif text-amber-900">You have no consigned lots yet</h2>
      <p className="text-amber-800 font-serif italic text-center">
        Submit your vintage items to be featured in our weekly Sunday auctions
      </p>
      <Button asChild className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif">
        <Link href="/items/create">Consign an Item</Link>
      </Button>
    </div>
  );
}
