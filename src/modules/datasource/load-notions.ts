import { Client as NotionClient } from "@notionhq/client";
import { NOTION_AUTH_REDIRECT_URL } from "@/lib/utils";
import { NotionAPILoader } from "langchain/document_loaders/web/notionapi";
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

interface INotionAuth {
  access_token: string;
  token_type: string;
  bot_id: string;
  workspace_name: string;
  workspace_icon: string;
  workspace_id: string;
  owner: { type: string; user: any };
  duplicated_template_id: string;
}

enum NotionItemType {
  Page = "page",
  Database = "database",
}

interface INotionResultItem {
  object: NotionItemType;
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  properties: any;
}

async function extractNotionResRecursively(notion: NotionClient, next_cursor: string | undefined) {
  const nextNotionRes = await notion.search({
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
    start_cursor: next_cursor,
  });

  if (nextNotionRes.has_more && nextNotionRes.next_cursor) {
    const nextNotionItems = await extractNotionResRecursively(notion, nextNotionRes.next_cursor);
    nextNotionRes.results.push(...nextNotionItems.results);
  }
  return nextNotionRes;
}

function printTitle(section?: string, title?: string) {
  if (!section && !title) return "";
  if (!section) return title || "";
  if (!title) return section || "";
  return `${section} / ${title}`;
}

export const loadNotions = async (notionAuth: INotionAuth) => {
  const notion = new NotionClient({ auth: notionAuth.access_token });

  const notionRes = await extractNotionResRecursively(notion, undefined);

  const lists = notionRes.results;

  // skip all partial items

  const loadedNotionItems = await Promise.all(
    lists.map((item) =>
      loadDBOrPage({
        accessToken: notionAuth.access_token,
        item,
      }),
    ),
  );

  return loadedNotionItems
    .flat()
    .filter(Boolean)
    .filter(
      (document) => document && document.pageContent?.length > 0 && document.id && document.type && document.title,
    ) as {
    pageContent: string;
    type: string;
    id: string;
    title: string;
  }[];
};

export const loadDBOrPage = async ({
  item,
  accessToken,
}: {
  item: PageObjectResponse | DatabaseObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse;
  accessToken: string;
}) => {
  const { object: type, id } = item;
  if (
    // skip all partial items
    !("url" in item) ||
    (type !== NotionItemType.Page && type !== NotionItemType.Database)
  ) {
    return null;
  }

  try {
    const pageLoader = new NotionAPILoader({
      clientOptions: {
        auth: accessToken,
      },
      id: id,
      type: type,
    });

    const page = await pageLoader.load();

    return page.map((p) => ({
      pageContent: p.pageContent,
      type: p.metadata.object as string,
      id: p.metadata.notionId as string,
      title:
        type === NotionItemType.Page
          ? printTitle(item.properties.title.title[0].plain_text, p.metadata?.properties?.title)
          : printTitle(item.title[0].plain_text, p.metadata?.properties?.title),
    }));
  } catch (e) {
    return null; // we shouldn't block other process if one page doesn't load
  }
};

export const authenticateNotion = async (code: string): Promise<INotionAuth> => {
  const encoded = Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: NOTION_AUTH_REDIRECT_URL,
    }),
  });

  const data: INotionAuth = await response.json();

  return data;
};
