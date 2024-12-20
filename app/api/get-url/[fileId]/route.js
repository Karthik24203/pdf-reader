import { db } from "@/config/db";
import { Files } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { fileId } = await params;

  try {
    const fileUrl = await db
      .select()
      .from(Files)
      .where(eq(Files.fileId, fileId));

    console.log("fileurl", fileUrl);
    return NextResponse.json(fileUrl);
  } catch (error) {
    console.error("Couldnt fetch the url ", error);
  }
}
