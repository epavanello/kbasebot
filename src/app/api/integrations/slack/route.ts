import {runSlackApp} from "@/app/api/integrations/slack/app";
import {NextRequest, NextResponse} from "next/server";
import {getDevErrorMessage} from "@/lib/utils";

export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        //
         await runSlackApp(body)

        return NextResponse.json({challenge: body?.challenge});
    } catch (e) {
        console.error(e);
        return new Response(getDevErrorMessage(e, e?.message || "slack integration error"), {
            status: 500,
        });
    }
}
