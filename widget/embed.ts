// create an iframe
const iframe = document.createElement("iframe");

// get current script chatbot id param
const scriptURL = (document.currentScript as HTMLScriptElement).src;
const chatbot_id = new URL(scriptURL).searchParams.get("chatbot_id");

if (!chatbot_id) {
  throw new Error("chatbot_id is required");
}

// set the src of the iframe to the chatbot url
iframe.src = `${process.env.NEXT_PUBLIC_URL}/c/${chatbot_id}`;

// set the style of the iframe
iframe.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 350px;
    height: 650px;
    border: none;
    border-radius: 10px 0 0 0;
    z-index: 99999
`;

// wait for dom to load
document.addEventListener("DOMContentLoaded", () => {
  // append the iframe to the body
  document.body.appendChild(iframe);
});
