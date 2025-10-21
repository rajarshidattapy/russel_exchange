import { EmptyState } from "@/app/auctions/empty-state";
import { ItemCard } from "@/app/item-card";
import { auth } from "@/auth";
import { database } from "@/db/database";
import { items } from "@/db/schema";
import { pageTitleStyles } from "@/styles";
import { eq } from "drizzle-orm";

export default async function MyAuctionPage() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const allItems = await database.query.items.findMany({
    where: eq(items.userId, session.user.id!),
  });

  const hasItems = allItems.length > 0;

  return (
    <main className="space-y-8">
      <div className="bg-amber-50 border-4 border-amber-800 p-6 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold font-serif text-amber-900">Your Consigned Lots</h1>
        <p className="text-amber-800 font-serif italic mt-2">
          Items you have submitted to The Russell Exchange
        </p>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-4 gap-8">
          {allItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
