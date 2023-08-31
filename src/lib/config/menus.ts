export const menus = {
  mainNav: () => {
    return [
      {
        title: "Guides",
        href: "/guides",
        disabled: true,
      },
      {
        title: "Repo",
        href: "/repo",
        disabled: true,
      },
    ];
  },
  sidebarNav: [
    {
      title: "Chatbots",
      href: "/app",
      icon: "layoutTemplate",
    },
    {
      title: "Account",
      href: "/app/account",
      icon: "billing",
    },
  ],
  // eslint-disable-next-line
  sidebarNavByChatbot: (chatbotId) => [
    {
      title: "Go Back",
      href: `/app`,
      icon: "material-symbols:arrow-back-rounded",
      className: "border-b border-gray-300 rounded-none mb-4 opacity-80",
    },
    {
      title: "Bot Preview",
      href: `/app/chatbots/${chatbotId}`,
      icon: "fluent:bot-sparkle-24-regular",
    },
    {
      title: "Settings",
      href: `/app/chatbots/${chatbotId}/settings`,
      icon: "gala:settings",
    },
    {
      title: "Share",
      href: `/app/chatbots/${chatbotId}/share`,
      icon: "tabler:world-share",
    },
  ],
};
