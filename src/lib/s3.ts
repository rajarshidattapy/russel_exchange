import { writeFile } from "fs/promises";
import path from "path";

export async function saveFileLocally(
  file: File,
  fileName: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to public/uploads directory
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, new Uint8Array(buffer));
  
  return fileName;
}
