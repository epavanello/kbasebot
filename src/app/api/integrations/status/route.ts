import { getDevErrorMessage } from "@/lib/utils";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try {

        return NextResponse.json({STATUS: 'OK'});
    } catch (e) {
        console.error(e);
        return new Response(getDevErrorMessage(e, e?.message || "slack integration error"), {
            status: 500,
        });
    }
}
