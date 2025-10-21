import { ItemCard } from "@/app/item-card";
import { database } from "@/db/database";

export default async function HomePage() {
  const allItems = await database.query.items.findMany();

  return (
    <main className="space-y-8">
      <div className="bg-amber-50 border-4 border-amber-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-5xl font-bold font-serif text-amber-900 mb-4">
          Weekly Sunday Auctions
        </h1>
        <p className="text-lg text-amber-800 font-serif italic">
          Vintage Furniture, Antiques &amp; Collectibles from Kolkata&apos;s Premier Auction House
        </p>
        <p className="text-sm text-amber-700 mt-2 font-serif">
          &quot;Everything is saleable&quot; - Founded 1940
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {allItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
