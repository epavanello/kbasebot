import { MainNav } from "@/components/layouts/navbar";
import Sidebar from "@/components/layouts/sidebar";
import { menus } from "@/lib/config/menus";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  seo: { title: string };
}

const MainLayout = ({ children, seo }: DashboardLayoutProps) => {
  return (
    <>
      <div className="relative flex flex-col h-[100vh] overflow-hidden">
        <header className="sticky top-0 z-40">
          <MainNav items={menus.mainNav()} />
        </header>
        <div className="flex flex-row flex-1 min-h-0">
          <aside className="hidden w-56 flex-col md:flex border-r overflow-auto">
            <Sidebar />
          </aside>
          {/*<PageTransition>*/}
          <main className="flex flex-col w-full flex-1 overflow-auto">{children}</main>
          {/*</PageTransition>*/}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
