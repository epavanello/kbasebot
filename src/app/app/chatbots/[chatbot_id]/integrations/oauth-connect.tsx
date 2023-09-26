import React, { FC, useEffect, useState } from "react";
import { popupCenter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface IOAuthConnect {
  provider: "slack";
  oauthUrl: string;
  btnLabel: string;
  btnIcon: string;
  btnStyle: any;
  btnClass: string;
}

const OauthConnect: FC<IOAuthConnect> = ({
  provider,
  oauthUrl,
  btnLabel,
  btnIcon,
  btnStyle,
  btnClass,
}) => {
  const [loading, setLoading] = useState(false);

  const handleOAuthConnect = async () => {
    popupCenter({
      url: oauthUrl,
      title: "Connect to " + provider,
      w: 500,
      h: 400,
    });
  };

  const connectOauth = async (code: string) => {
    try {
      setLoading(true);
      // const res = await axios.get<INotion[]>(
      //     `/api/chatbots/datasource/load-notion?code=${code}&chatbot_id=${chatbotId}`,
      // );
      // if (res.data?.length) {
      //     appendNotion(res.data);
      // }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("here", event.origin, process.env.NEXT_PUBLIC_URL, event);
      // Verifica l'origine del messaggio
      if (event.origin !== `${process.env.NEXT_PUBLIC_URL}`) return;

      // Verifica il tipo di messaggio
      if (event.data?.["notion-code"]) {
        connectOauth(event.data["notion-code"]);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <Button
      disabled={loading}
      loading={loading}
      onClick={handleOAuthConnect}
      icon={btnIcon}
      className={btnClass}
      style={btnStyle}
      iconClassName="text-md"
    >
      {btnLabel}
    </Button>
  );
};

export default OauthConnect;
