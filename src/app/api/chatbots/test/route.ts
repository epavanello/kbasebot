import { Database } from "@/lib/types/database.types";
import { getErrorMessage } from "@/lib/utils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseAdminClient = createServerComponentClient<Database>({
      cookies: cookies,
    });

    const { data, error } = await supabaseAdminClient
      .from("conversations")
      .select("*");

    return NextResponse.json(
      { data, error },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
