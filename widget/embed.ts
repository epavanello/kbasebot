import { Settings } from "@/lib/supabase";
import { isContrastColorWhite } from "@/lib/utils";

// create an iframe
const iframe = document.createElement("iframe");
const button = document.createElement("button");
const img = document.createElement("img");

// get current script chatbot id param
const scriptURL = (document.currentScript as HTMLScriptElement).src;
const chatbot_id = new URL(scriptURL).searchParams.get("chatbot_id");

if (!chatbot_id) {
  throw new Error("chatbot_id is required");
}

// set the src of the iframe to the chatbot url
iframe.src = `${process.env.NEXT_PUBLIC_URL}/c/${chatbot_id}`;

iframe.style.cssText = `
  position: fixed;
  z-index: 9999999;
  border: none;
  width: 448px;
  bottom: 5rem;
  height: 70vh;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
`;

// add hover effect to the button
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

const request = fetch(
  `${process.env.NEXT_PUBLIC_URL}/api/chatbots/settings?chatbotId=${chatbot_id}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  },
);

request.then(async (response) => {
  const { settings } = (await response.json()) as {
    settings: Settings;
  };
  if (!settings) {
    throw new Error("Chatbot settings not found");
  }
  if (settings.chatbot_bubble_align === "right") {
    iframe.style.right = "16px";
    button.style.right = "16px";
  } else {
    iframe.style.left = "16px";
    button.style.left = "16px";
  }
  button.style.backgroundColor =
    settings.primary_color || "hsl(142.1 76.2% 36.3%)";

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
  document.body.appendChild(iframe);
  document.body.appendChild(button);
});

window.addEventListener("message", (event) => {
  // Verifica l'origine del messaggio
  if (event.origin !== `${process.env.NEXT_PUBLIC_URL}`) return;

  // Verifica il tipo di messaggio
  if (event.data.type === "close") {
    closeChatbot();
  }
});

window.addEventListener("click", (event) => {
  closeChatbot();
});
