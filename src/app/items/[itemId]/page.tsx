import { createBidAction } from "@/app/items/[itemId]/actions";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBidsForItem } from "@/data-access/bids";
import { getItem } from "@/data-access/items";
import { pageTitleStyles } from "@/styles";
import { isBidOver } from "@/util/bids";
import { formatToDollar } from "@/util/currency";
import { getImageUrl } from "@/util/files";
import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";

function formatTimestamp(timestamp: Date) {
  return formatDistance(timestamp, new Date(), { addSuffix: true });
}

export default async function ItemPage({
  params: { itemId },
}: {
  params: { itemId: string };
}) {
  const session = await auth();

  const item = await getItem(parseInt(itemId));

  if (!item) {
    return (
      <div className="space-y-8 flex flex-col items-center mt-12">
        <Image src="/package.svg" width="200" height="200" alt="Package" />

        <h1 className="text-4xl font-bold font-serif text-amber-900">Lot Not Found</h1>
        <p className="text-center font-serif text-amber-800">
          The lot you&apos;re trying to view is invalid.
          <br />
          Please go back and browse our available lots.
        </p>

        <Button asChild className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif">
          <Link href={`/`}>View Auctions</Link>
        </Button>
      </div>
    );
  }

  const allBids = await getBidsForItem(item.id);

  const hasBids = allBids.length > 0;

  const canPlaceBid =
    session && item.userId !== session.user.id && !isBidOver(item);

  return (
    <main className="space-y-8">
      <div className="flex gap-8">
        <div className="flex flex-col gap-6">
          <div className="bg-amber-50 border-4 border-amber-800 p-6 rounded-lg">
            <h1 className="text-4xl font-bold font-serif text-amber-900">
              <span className="font-normal">Lot:</span> {item.name}
            </h1>
          </div>
          {isBidOver(item) && (
            <Badge className="w-fit font-serif" variant="destructive">
              Lot Closed
            </Badge>
          )}

          <Image
            className="rounded-lg border-4 border-amber-800 shadow-xl"
            src={getImageUrl(item.fileKey)}
            alt={item.name}
            width={400}
            height={400}
          />
          <div className="text-xl space-y-4 bg-amber-50 border-2 border-amber-800 p-6 rounded-lg font-serif">
            <div className="text-amber-900">
              Current Bid{" "}
              <span className="font-bold">
                ₹{formatToDollar(item.currentBid)}
              </span>
            </div>
            <div className="text-amber-800">
              Reserve Price{" "}
              <span className="font-bold">
                ₹{formatToDollar(item.startingPrice)}
              </span>
            </div>
            <div className="text-amber-700">
              Bid Increment{" "}
              <span className="font-bold">
                ₹{formatToDollar(item.bidInterval)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center bg-amber-50 border-4 border-amber-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold font-serif text-amber-900">Bidding History</h2>
            {canPlaceBid && (
              <form action={createBidAction.bind(null, item.id)}>
                <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif">Place Bid</Button>
              </form>
            )}
          </div>

          {hasBids ? (
            <ul className="space-y-4">
              {allBids.map((bid) => (
                <li key={bid.id} className="bg-amber-50 border-2 border-amber-800 rounded-lg p-6">
                  <div className="flex gap-4 font-serif text-amber-900">
                    <div>
                      <span className="font-bold">
                        ₹{formatToDollar(bid.amount)}
                      </span>{" "}
                      by <span className="font-bold">{bid.user.name}</span>
                    </div>
                    <div className="text-amber-700">{formatTimestamp(bid.timestamp)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-8 bg-amber-50 border-4 border-amber-800 rounded-lg p-12">
              <Image
                src="/package.svg"
                width="200"
                height="200"
                alt="Package"
              />
              <h2 className="text-2xl font-bold font-serif text-amber-900">No bids yet</h2>
              <p className="font-serif text-amber-700 italic">Be the first to bid on this lot</p>
              {canPlaceBid && (
                <form action={createBidAction.bind(null, item.id)}>
                  <Button className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif">Place Opening Bid</Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
