import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  // Fail closed: never accept webhooks without a configured secret.
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify signature
    const expectedSignature = `sha256=${crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")}`;

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse payload
    const payload = JSON.parse(rawBody);
    const { modules, action, table } = payload;

    // Each module name is a CMS endpoint name, which is also the cache tag fetchAPI() puts on that endpoint.
    // "max" = stale-while-revalidate: the next visit gets fresh data (the single-argument form is deprecated).
    const tags = Array.isArray(modules) ? modules.filter((m): m is string => typeof m === "string") : [];
    tags.forEach((tag) => revalidateTag(tag, "max"));
    console.log(`[Webhook] Revalidated tags: ${tags.join(", ") || "(none)"}`);

    // Pages that render CMS content also carry the layout (menu, footer, SEO), so refresh the whole tree.
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Revalidation triggered successfully",
      action,
      table,
    });
  } catch (error: unknown) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
