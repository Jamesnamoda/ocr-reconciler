import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("MP Webhook received:", body);
    
    // TODO: Implement webhook processing logic
    // This is a stub for future webhook implementation
    
    return NextResponse.json({ status: "received" });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
