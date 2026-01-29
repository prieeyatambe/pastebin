import { connectDB } from "@/src/lib/dbconnection";
import paste from "@/src/lib/models/paste";
import { getNow } from "@/src/lib/timer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    const now = getNow(req);

    const pastes = await paste.findOneAndUpdate(
      {
        pasteId: id,
        $and: [
          {
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
          },
          {
            $or: [
              { maxViews: null },
              { $expr: { $lt: ["$views", "$maxViews"] } },
            ],
          },
        ],
      },
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!pastes) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      content: pastes.content,
      remaining_views:
        pastes.maxViews === null ? null : pastes.maxViews - pastes.views,
      expires_at: pastes.expiresAt,
    });
  } catch (error) {
    console.log(error);
    NextResponse.json({
      status: 500,
      message: "server error",
    });
  }
}
