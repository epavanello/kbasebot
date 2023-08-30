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
      title: "Open Chatbot",
      href: `/app/chatbots/${chatbotId}/pages`,
      icon: "tabler:drag-drop",
      className: "bg-indigo-100 text-indigo-700",
      status: {
        text: "Beta",
      },
    },
    {
      title: "Settings",
      href: `/app/sites/${chatbotId}/settings`,
      icon: "gala:settings",
    },
  ],
};
