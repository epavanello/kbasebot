import { Settings } from "@/lib/supabase";
import { isContrastColorWhite } from "@/lib/utils";

// create an iframe
const iframe = document.createElement("iframe");
const button = document.createElement("button");
const img = document.createElement("img");

// get current script chatbot id param
const currentScript = document.currentScript as HTMLScriptElement;
const scriptURL = currentScript.src;
const chatbot_id = new URL(scriptURL).searchParams.get("chatbot_id") || currentScript.getAttribute("data-chatbot-id");
const authToken = currentScript.getAttribute("data-auth-token");
const containterSelector = currentScript.getAttribute("data-container");

if (!chatbot_id) {
  throw new Error("chatbot_id is required");
}

iframe.id = "kbasebot-iframe";
iframe.style.cssText = `
  position: fixed;
  z-index: 9999999;
  border: none;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
`;

button.id = "kbasebot-button";
button.style.cssText = `
  overflow: hidden;
  padding: 0px;
  color: #fff;
  border-radius: 9999px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 16px;
  width: 56px;
  height: 56px;
  z-index: 9999998;
  border: none;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  transition: all 0.2s ease 0s;
`;
button.addEventListener("mouseenter", () => {
  button.style.transform = "scale(1.1)";
});
button.addEventListener("mouseleave", () => {
  button.style.transform = "scale(1)";
});
button.addEventListener("mousedown", () => {
  button.style.transform = "scale(0.9)";
});
button.addEventListener("mouseup", () => {
  button.style.transform = "scale(1)";
});

img.style.cssText = `
  width: 32px;
  height: 32px;
`;

let isOpen = false;
let bubbleLogo = "";
let closeLogo = "";

function openChatbot() {
  if (!iframe.src) {
    // set the src of the iframe to the chatbot url
    iframe.src = `${process.env.NEXT_PUBLIC_URL}/c/${chatbot_id}`;
    if (authToken) {
      iframe.onload = () => {
        iframe.contentWindow?.postMessage(
          {
            type: "auth",
            token: authToken,
          },
          `${process.env.NEXT_PUBLIC_URL}`,
        );
      };
    }
  }

  iframe.style.display = "block";
  img.src = closeLogo;
  isOpen = true;
}

function closeChatbot() {
  iframe.style.display = "none";
  img.src = bubbleLogo;
  isOpen = false;
}

button.addEventListener("click", (e) => {
  if (isOpen) {
    closeChatbot();
  } else {
    openChatbot();
  }
  e.stopPropagation();
});

// load settings

const request = fetch(`${process.env.NEXT_PUBLIC_URL}/api/chatbots/settings?chatbotId=${chatbot_id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

let settings: Settings | null = null;
const detectMobile = window.matchMedia("(max-width: 576px)");
type Side = "left" | "right";
function setPosition() {
  const side: Side = (settings?.chatbot_bubble_align as Side) || "right";
  const normalMargin = 16;

  if (detectMobile.matches) {
    iframe.style[side] = "0px";
    button.style[side] = "4px";
    iframe.style.height = "calc(100vh - " + (56 + 4 * 2) + "px)";
    iframe.style.width = "100%";
    iframe.style.bottom = 56 + 4 * 2 + "px";
    button.style.bottom = "4px";
  } else {
    iframe.style[side] = normalMargin + "px";
    button.style[side] = normalMargin + "px";
    iframe.style.height = "70vh";
    iframe.style.width = "448px";
    iframe.style.bottom = 56 + normalMargin * 2 + "px";
    button.style.bottom = normalMargin + "px";
  }
}

request.then(async (response) => {
  settings = (
    (await response.json()) as {
      settings: Settings;
    }
  ).settings;
  if (!settings) {
    throw new Error("Chatbot settings not found");
  }

  setPosition();

  button.style.backgroundColor = settings.primary_color || "hsl(142.1 76.2% 36.3%)";

  let contrastWhite = isContrastColorWhite(settings.primary_color);

  if (settings.chatbot_bubble_logo) {
    bubbleLogo = settings.chatbot_bubble_logo;
  } else {
    bubbleLogo = contrastWhite
      ? process.env.NEXT_PUBLIC_URL + "/bot-light.svg"
      : process.env.NEXT_PUBLIC_URL + "/bot-dark.svg";
  }

  closeLogo = contrastWhite
    ? process.env.NEXT_PUBLIC_URL + "/close-light.svg"
    : process.env.NEXT_PUBLIC_URL + "/close-dark.svg";

  closeChatbot();

  button.appendChild(img);

  let container: HTMLElement | null = null;
  if (containterSelector && (container = document.querySelector(containterSelector))) {
    container.appendChild(button);
    container.appendChild(iframe);
  }
  // check if currentScript is in the body at any position
  else if (document.body.contains(currentScript)) {
    // append the button and the iframe after the currentScript
    currentScript.after(button);
    currentScript.after(iframe);
  }
  // append the button and the iframe at the end of the body
  else {
    document.body.appendChild(button);
    document.body.appendChild(iframe);
  }
});

window.addEventListener("resize", setPosition);

window.addEventListener("message", (event) => {
  // Verifica l'origine del messaggio
  if (event.origin !== `${process.env.NEXT_PUBLIC_URL}`) return;

  // Verifica il tipo di messaggio
  if (event.data.type === "close") {
    closeChatbot();
  }
});

window.addEventListener("click", () => {
  closeChatbot();
});
