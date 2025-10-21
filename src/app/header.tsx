"use client";

import { Button } from "@/components/ui/button";
import { formatToDollar } from "@/util/currency";
import {
  NotificationCell,
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const session = useSession();

  const userId = session?.data?.user?.id;

  return (
    <div className="bg-amber-900 py-4 border-b-4 border-amber-700 shadow-lg">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link href="/" className="hover:opacity-80 flex flex-col items-center gap-1 transition-opacity">
            <Image src="/logo.png" width="60" height="60" alt="Logo" />
            <div className="text-amber-50 font-serif text-xl font-bold tracking-wide">
              THE RUSSELL EXCHANGE
            </div>
            <div className="text-amber-200 text-xs font-serif italic">
              Est. 1940 - Russell Street, Kolkata
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-amber-50 hover:text-amber-200 transition-colors font-serif flex items-center gap-1">
              Weekly Auctions
            </Link>

            {userId && (
              <>
                <Link
                  href="/items/create"
                  className="text-amber-50 hover:text-amber-200 transition-colors font-serif flex items-center gap-1"
                >
                  Consign Item
                </Link>

                <Link
                  href="/auctions"
                  className="text-amber-50 hover:text-amber-200 transition-colors font-serif flex items-center gap-1"
                >
                  My Lots
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userId && (
            <>
              <NotificationIconButton
                ref={notifButtonRef}
                onClick={(e) => setIsVisible(!isVisible)}
              />
              <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                renderItem={({ item, ...props }) => (
                  <NotificationCell {...props} item={item}>
                    <div className="rounded-xl">
                      <Link
                        className="text-blue-400 hover:text=blue-500"
                        onClick={() => {
                          setIsVisible(false);
                        }}
                        href={`/items/${item.data.itemId}`}
                      >
                        Someone outbidded you on{" "}
                        <span className="font-bold">{item.data.itemName}</span>{" "}
                        by ${formatToDollar(item.data.bidAmount)}
                      </Link>
                    </div>
                  </NotificationCell>
                )}
              />
            </>
          )}

          {session?.data?.user.image && (
            <Image
              src={session.data.user.image}
              width="40"
              height="40"
              alt="user avatar"
              className="rounded-full border-2 border-amber-200"
            />
          )}
          <div className="text-amber-50 font-serif">{session?.data?.user?.name}</div>
          <div>
            {userId ? (
              <Button
                className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-serif"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                Sign Out
              </Button>
            ) : (
              <Button
                className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-serif"
                type="submit"
                onClick={() => signIn()}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
