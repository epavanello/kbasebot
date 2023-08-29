import { MainNav } from "@/components/layouts/navbar";
import PageTransition from "@/components/layouts/page-transition";
import Sidebar from "@/components/layouts/sidebar";
import { menus } from "@/lib/config/menus";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  seo: { title: string };
}

const MainLayout = ({ children, seo }: DashboardLayoutProps) => {
  return (
    <div className="mx-auto flex flex-col h-screen">
      <header className="sticky top-0 z-40">
        <MainNav items={menus.mainNav()} />
      </header>
      <div
        style={{ height: "calc(100vh - 60px)" }}
        className="grid md:grid-cols-[200px_1fr]"
      >
        <aside className="hidden w-[200px] flex-col md:flex border-r">
          <Sidebar items={menus.sidebarNav} />
        </aside>
        <PageTransition>
          <main className="flex w-full flex-1 flex-col overflow-scroll">
            {children}
          </main>
        </PageTransition>
      </div>
    </div>
  );
};

export default MainLayout;
