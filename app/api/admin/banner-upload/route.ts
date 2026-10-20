import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { BANNER_MAX_BYTES, BANNER_TYPES } from "@/lib/banner";
import { getAdminSession } from "@/lib/require-admin";

/**
 * Issues short-lived tokens so the admin's browser can upload a cover file
 * straight to Vercel Blob. Videos are too large to pass through a server action.
 */
export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบผู้ดูแลอีกครั้ง" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "ยังไม่ได้ตั้งค่าที่เก็บไฟล์ (BLOB_READ_WRITE_TOKEN)" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("banner/")) throw new Error("Invalid pathname");
        return {
          allowedContentTypes: [...new Set(Object.values(BANNER_TYPES).map((t) => t.contentType))],
          maximumSizeInBytes: BANNER_MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "อัปโหลดไม่สำเร็จ" }, { status: 400 });
  }
}
