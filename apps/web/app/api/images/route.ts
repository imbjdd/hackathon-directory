import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET!;

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const res = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key })
  );

  const body = res.Body as ReadableStream;
  return new NextResponse(body as unknown as BodyInit, {
    headers: {
      "Content-Type": res.ContentType || "image/png",
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      ...(res.ContentLength ? { "Content-Length": String(res.ContentLength) } : {}),
    },
  });
}
