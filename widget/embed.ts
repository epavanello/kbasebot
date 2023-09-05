// create an iframe
const iframe = document.createElement("iframe");
const button = document.createElement("button");
const img = document.createElement("img");

// get current script chatbot id param
const scriptURL = (document.currentScript as HTMLScriptElement).src;
const chatbot_id = new URL(scriptURL).searchParams.get("chatbot_id");
const chatbot_color =
  new URL(scriptURL).searchParams.get("chatbot_color") ||
  "hsl(142.1 76.2% 36.3%)";

if (!chatbot_id) {
  throw new Error("chatbot_id is required");
}

// set the src of the iframe to the chatbot url
iframe.src = `${process.env.NEXT_PUBLIC_URL}/c/${chatbot_id}`;

iframe.style.cssText = `
  position: fixed;
  right: 1rem;
  z-index: 9999999;
  border: none;
  width: 448px;
  bottom: 5rem;
  height: 70vh;
  border-radius: 0.75rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  display: none;
`;

// add hover effect to the button
button.style.cssText = `
  overflow: hidden;
  padding: 0px;
  background-color: ${chatbot_color};
  color: #fff;
  border-radius: 9999px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 16px;
  right: 16px;
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

img.src = `${process.env.NEXT_PUBLIC_URL}/bot.svg`;
img.style.cssText = `
  width: 32px;
  height: 32px;
`;

let isOpen = false;

function openChatbot() {
  iframe.style.display = "block";
  img.src = `${process.env.NEXT_PUBLIC_URL}/close.svg`;
  isOpen = true;
}

function closeChatbot() {
  iframe.style.display = "none";
  img.src = `${process.env.NEXT_PUBLIC_URL}/bot.svg`;
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

// wait for dom to load
document.addEventListener("DOMContentLoaded", () => {
  // append the iframe to the body
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
