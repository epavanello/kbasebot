import { SidebarItem } from "@/components/layouts/sidebar";

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
  ] as SidebarItem[],
  // eslint-disable-next-line
  sidebarNavByChatbot: (chatbotId: string): SidebarItem[] => [
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
      title: "Customize",
      href: `/app/chatbots/${chatbotId}/customize`,
      icon: "clarity:design-line",
    },
    {
      title: "Conversations",
      href: `/app/chatbots/${chatbotId}/conversations`,
      icon: "jam:messages-alt",
    },
    {
      title: "Leads",
      href: `/app/chatbots/${chatbotId}/leads`,
      icon: "pepicons-pencil:people",
      status: {
        text: "New",
      },
    },
    {
      title: "Functions",
      href: `/app/chatbots/${chatbotId}/functions`,
      icon: "material-symbols:webhook",
      status: {
        text: "New",
      },
    },
    {
      title: "Analytics",
      href: `/app/chatbots/${chatbotId}/analytics`,
      icon: "clarity:analytics-line",
      status: {
        text: "New",
      },
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
  ],
};
