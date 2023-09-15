import { Client as NotionClient } from "@notionhq/client";
import { NOTION_AUTH_REDIRECT_URL } from "@/lib/utils";
import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPILoader } from "langchain/document_loaders/web/notionapi";

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

export const loadNotions = async (notionAuth: INotionAuth) => {
  const notion = new NotionClient({ auth: notionAuth.access_token });

  const notionRes: SearchResponse = await notion.search({
    // query: 'External tasks',
    // filter: {
    //   value: 'database',
    //   property: 'object'
    // },
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
  });

  const lists = notionRes.results;

  const loadedNotionItems = await Promise.all(
    lists.map((item) => {
      return loadDBOrPage({
        id: item.id,
        type: item.object,
        accessToken: notionAuth.access_token,
      });
    }),
  );

  return loadedNotionItems.flat().filter(Boolean);
};

export const loadDBOrPage = async ({ type, id, accessToken }) => {
  if (type !== NotionItemType.Page && type !== NotionItemType.Database)
    return null;

  try {
    console.log({ accessToken });
    const pageLoader = new NotionAPILoader({
      clientOptions: {
        auth: accessToken,
      },
      id: id,
      type: type,
    });

    // A page contents is likely to be more than 1000 characters, so it's split into multiple documents (important for vectorization)
    const page = await pageLoader.loadAndSplit();
    return page;
  } catch (e) {
    return null; // we shouldn't block other process if one page doesn't load
  }
};

export const authenticateNotion = async (code): Promise<INotionAuth> => {
  const encoded = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`,
  ).toString("base64");

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
