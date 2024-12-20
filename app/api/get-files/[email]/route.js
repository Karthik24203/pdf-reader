import { db } from "@/config/db";
import { Files, Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { email } = await params;

  try {
    const userId = await db
      .select({ id: Users.id }) // Explicitly select the `id` from Users
      .from(Users) // Query the Users table
      .where(eq(Users.email, email));

    const id = userId[0]?.id;

    const fetchFiles = await db
      .select()
      .from(Files)
      .where(eq(Files.userId, id));

    return NextResponse.json({ file: fetchFiles });
  } catch (error) {
    console.error("error in fetching files", error);
  }
}
