import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // In dev you can use explicit credentials in .env.local. In production prefer IAM role.
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

export async function POST(request) {
  try {
    // Accept FormData with a "file" field
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // read file bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // create timestamped filename inside receipts/ folder
    const timestamp = Date.now();
    // sanitise filename a little (optional)
    const originalName = file.name.replace(/\s+/g, "_");
    const key = `receipts/${timestamp}-${originalName}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // e.g. expenseease-uploads
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
      Metadata: {
        email: (formData.get("email") || "").toString()
      }
    };

    await s3.send(new PutObjectCommand(params));

    return NextResponse.json({
      message: "Upload successful",
      key,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
