import { Button } from "@/components/ui/button";
import { Item } from "@/db/schema";
import { isBidOver } from "@/util/bids";
import { formatToDollar } from "@/util/currency";
import { getImageUrl } from "@/util/files";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export function ItemCard({ item }: { item: Item }) {
  return (
    <div key={item.id} className="border-4 border-amber-800 bg-amber-50 p-6 rounded-lg shadow-lg space-y-3 hover:shadow-2xl transition-shadow">
      <Image
        src={getImageUrl(item.fileKey)}
        alt={item.name}
        width={200}
        height={200}
        className="w-full h-48 object-cover rounded border-2 border-amber-700"
      />
      <h2 className="text-xl font-bold font-serif text-amber-900">{item.name}</h2>
      <p className="text-base font-serif text-amber-800">
        Reserve: ${formatToDollar(item.startingPrice)}
      </p>

      {isBidOver(item) ? (
        <p className="text-base font-serif text-red-700 font-bold">Lot Closed</p>
      ) : (
        <p className="text-base font-serif text-amber-700">
          Closes: {format(item.endDate, "eeee M/dd/yy")}
        </p>
      )}

      <Button
        asChild
        variant={isBidOver(item) ? "outline" : "default"}
        className={
          isBidOver(item)
            ? "font-serif border-2 border-amber-800 text-amber-900 hover:bg-amber-100"
            : "font-serif bg-amber-800 hover:bg-amber-900 text-amber-50"
        }
      >
        <Link href={`/items/${item.id}`}>
          {isBidOver(item) ? "View Lot" : "Bid Now"}
        </Link>
      </Button>
    </div>
  );
}
