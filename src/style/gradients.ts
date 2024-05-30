export const gradients = {
  OCEANIC: "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600",
  BLUEN: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white via-blue-600 to-teal-400",
  HYPER: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  COTTON_CANDY: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400",
  BEACHSIDE: "bg-gradient-to-r from-yellow-200 via-green-200 to-green-500",
  SEAFOAM: "bg-gradient-to-r from-green-200 via-green-300 to-blue-500",
  PANDORA: "bg-gradient-to-r from-green-200 via-green-400 to-purple-700",
  SIERRA_MIST: "bg-gradient-to-r from-yellow-200 via-green-200 to-green-300",
  EARTH: "bg-gradient-to-r from-teal-200 to-lime-200",
  HERO_LIGHT: "bg-gradient-to-r from-primary-200 to-primary-700",
};

export function getRandomGradient() {
  const keys = Object.keys(gradients);
  const randomKey = keys[Math.floor(Math.random() * keys.length)] as keyof typeof gradients;
  return gradients[randomKey];
}

function uuidToFixedNumber(uuid: string): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    let character = uuid.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) / 0xffffffff;
}

export function getChatbotGradient(chatbotId: string) {
  const keys = Object.keys(gradients);
  // get a repeatable random number based on the chatbot id
  const randomKey = keys[Math.floor(uuidToFixedNumber(chatbotId) * keys.length)] as keyof typeof gradients;

  return gradients[randomKey];
}
