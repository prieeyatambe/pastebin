import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { connectDB } from "@/src/lib/dbconnection";
import paste from "@/src/lib/models/paste";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: "Invalid ttl_seconds" },
        { status: 400 },
      );
    }

    if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
    }

    await connectDB();

    const expiresAt = ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000)
      : null;

    const pasteId = nanoid(10);
    const pastes = await paste.create({
      pasteId,
      content,
      expiresAt,
      maxViews: max_views ?? null,
    });
    return NextResponse.json({
      id: pastes.pasteId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${pastes.pasteId}`,
    });
  } catch (error) {
    console.log(error);
    NextResponse.json({
      status: 500,
      message: "server error",
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const pastes = await paste
      .find({})
      .select("pasteId content expiresAt maxViews views createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      count: pastes.length,
      pastes: pastes.map((p) => ({
        id: p.pasteId,
        content: p.content,
        views: p.views,
        maxViews: p.maxViews,
        expiresAt: p.expiresAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.log(error);
    NextResponse.json({
      status: 500,
      message: "server error",
    });
  }
}
