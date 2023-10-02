export const menus = {
  mainNav: () => {
    return [
      // {
      //   title: "Guides",
      //   href: "/guides",
      //   disabled: true,
      // },
      // {
      //   title: "Repo",
      //   href: "/repo",
      //   disabled: true,
      // },
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
  sidebarNavByChatbot: (chatbotId: string) => [
    {
      title: "Go Back",
      href: `/app`,
      icon: "material-symbols:arrow-back-rounded",
      className: "border-b border-gray-300 rounded-none mb-4 opacity-80",
    },
    {
      title: "Preview",
      href: `/app/chatbots/${chatbotId}`,
      icon: "fluent:bot-sparkle-24-regular",
    },
    {
      title: "Sources",
      href: `/app/chatbots/${chatbotId}/sources`,
      icon: "material-symbols:source-notes-outline-sharp",
    },
    {
      title: "Conversations",
      href: `/app/chatbots/${chatbotId}/conversations`,
      icon: "jam:messages-alt",
    },
    {
      title: "Customize",
      href: `/app/chatbots/${chatbotId}/customize`,
      icon: "clarity:design-line",
    },
    {
      title: "Analytics",
      href: `/app/chatbots/${chatbotId}/analytics`,
      icon: "clarity:analytics-line",
    },
    {
      title: "Share",
      href: `/app/chatbots/${chatbotId}/share`,
      icon: "tabler:world-share",
    },
    {
      title: "Settings",
      href: `/app/chatbots/${chatbotId}/settings`,
      icon: "gala:settings",
    },
    {
      title: "Leads",
      href: `/app/chatbots/${chatbotId}/leads`,
      icon: "gala:settings",
    },
  ],
};
