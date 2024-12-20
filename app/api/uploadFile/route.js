import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/services/cloudinary";
import { db } from "@/config/db";
import { Files, Users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extracting the PDF file and file name from the FormData
    const pdfFile = formData.get("file");
    const fileName = formData.get("fileName");
    const userEmail = formData.get("userEmail");

    if (!pdfFile || !fileName || !userEmail) {
      return NextResponse.json(
        { error: "File, file name, and user email are required" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await pdfFile.arrayBuffer();
    const base64File = Buffer.from(buffer).toString("base64");

    // Upload the file to Cloudinary
    const uploadResult = await uploadToCloudinary(
      `data:${pdfFile.type};base64,${base64File}`
    );

    // Ensure the URL is served over HTTPS
    const secureFileUrl = uploadResult.url.replace("http://", "https://");

    const userId = await db
      .select({ id: Users.id }) // Explicitly select the `id` from Users
      .from(Users) // Query the Users table
      .where(eq(Users.email, userEmail))
      .execute();

    const id = userId[0].id;
    console.log(secureFileUrl); // Log the secure URL
    const fileupload = await db
      .insert(Files)
      .values({
        fileUrl: secureFileUrl, // Use the HTTPS URL
        fileName: fileName,
        userId: id,
      })
      .returning({ fileId: Files.fileId });

    return NextResponse.json({
      message: "File uploaded successfully",
      fileUrl: secureFileUrl, // Return the HTTPS URL
      fileName,
      userId: id,
      fileId: fileupload[0].fileId,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
