import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { email } = await params;
  try {
    const result = await db.select().from(Users).where(eq(Users.email, email));

    return NextResponse.json({ result: result });
  } catch (error) {
    console.error("unable to uprgade the plan", error);
  }
}
