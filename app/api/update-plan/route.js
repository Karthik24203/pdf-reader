import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const { userEmail } = await req.json();
  console.log(userEmail);
  try {
    const update = await db
      .update(Users)
      .set({ upgrade: true })
      .where(eq(Users.email, userEmail))
      .returning({ upgrade: Users.upgrade });

    console.log(update);

    return NextResponse.json({ update: update });
  } catch (error) {
    console.error("unable to uprgade the plan", error);
  }
}
