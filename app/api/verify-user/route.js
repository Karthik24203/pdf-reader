import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { user } = await req.json();

  try {
    const userInfo = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress.emailAddress));

    if (userInfo?.length == 0) {
      const saveResult = await db
        .insert(Users)
        .values({
          name: user?.fullName,
          email: user?.primaryEmailAddress.emailAddress,
        })
        .returning({ Users });
      return NextResponse.json({ result: saveResult[0].Users });
    }
    return NextResponse.json({ result: userInfo[0] });
  } catch (error) {
    console.error("Error fetching user info:", error);
  }

  return NextResponse.json({ result: user });
}
