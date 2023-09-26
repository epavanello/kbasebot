import { IOAuthConnect } from "@/app/app/chatbots/[chatbot_id]/integrations/oauth-connect";
export const getCommonOAuthRedirectUrl = (provider) =>
  `${process.env.NEXT_PUBLIC_URL}/auth/${provider}`;

export const integrations: IOAuthConnect[] = [
  {
    provider: "slack",
    oauthUrl: `https://slack.com/oauth/v2/authorize?scope=im%3Ahistory&amp;user_scope=&amp;redirect_uri=${getCommonOAuthRedirectUrl(
      "slack",
    )}&client_id=5932288287575.5946854693282`,
    btnLabel: "Add To Slack",
    btnIcon: "logos:slack-icon",
    btnClass: "",
    btnStyle: {
      color: "#fff",
      backgroundColor: "#4A154B",
    },
  },
];
