import { NextResponse } from "next/server";

import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/database.types";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/utils";
import { IFile } from "@/lib/store/use-datasource-store";
import { loadFIlesByExtension } from "@/modules/datasource/load-docs";
import { checkMaxCharactersToTrain, getSubscription } from "@/lib/supabase";
import { getPermissions } from "@/lib/permissions/plans";
export const dynamic = "force-dynamic";
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const chatbot_id = req.nextUrl.searchParams.get("chatbot_id");

    if (!chatbot_id) {
      throw new Error("chatbot-id-not-found");
    }

    const supabaseServerClient = createRouteHandlerClient<Database>({
      cookies,
    });

    const {
      data: { user },
    } = await supabaseServerClient.auth.getUser();

    if (!user) {
      throw new Error("unauthorized");
    }

    const subscription = await getSubscription(supabaseServerClient, user.id);

    const { permission } = getPermissions(subscription);

    await checkMaxCharactersToTrain(supabaseServerClient, chatbot_id, permission);

    const file: File | null = (await req.formData()).get("file") as unknown as File;

    if (!file) {
      throw new Error("file-not-found");
    }

    const fileName = `/${chatbot_id}/${file.name}`;
    file.name;
    const { data, error } =
      (await supabaseServerClient.storage.from("files").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      })) || {};

    if (error) {
      throw new Error(error.message);
    }

    const document = await loadFIlesByExtension(file);

    if (!document || document.length === 0) {
      throw new Error("no-document-found");
    }

    const doc = (
      await supabaseServerClient
        .from("chatbot_docs")
        .upsert({
          file_name: data.path,
          chatbot_id,
          content: document[0].pageContent,
          chars: document[0].pageContent.length,
        })
        .select()
        .single()
        .throwOnError()
    ).data!;

    return NextResponse.json({
      name: doc.file_name.split("/").pop() || "",
      chars: doc.chars,
      id: doc.id,
    } as IFile);
  } catch (e) {
    console.error(e);
    return new Response(getErrorMessage(e, "Chatbot datasource error"), {
      status: 500,
    });
  }
}
