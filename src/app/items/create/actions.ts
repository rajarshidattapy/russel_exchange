"use server";

import { revalidatePath } from "next/cache";
import { database } from "@/db/database";
import { items } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { saveFileLocally } from "@/lib/s3";

export async function createItemAction({
  file,
  name,
  startingPrice,
  endDate,
}: {
  file: File;
  name: string;
  startingPrice: number;
  endDate: Date;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = session.user;

  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const originalName = file.name;
  const extension = originalName.split('.').pop();
  const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

  // Save file locally
  const fileName = await saveFileLocally(file, uniqueFileName);

  await database.insert(items).values({
    name,
    startingPrice,
    fileKey: fileName,
    currentBid: startingPrice,
    userId: user.id,
    endDate,
  });

  redirect("/");
}
