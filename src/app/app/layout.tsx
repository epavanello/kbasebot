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
      <div className="relative flex h-[100vh] flex-col overflow-hidden">
        <header className="sticky top-0 z-40">
          <MainNav items={menus.mainNav()} />
        </header>
        <div className="flex min-h-0 flex-1 flex-row">
          <aside className="hidden w-56 flex-col overflow-auto border-r md:flex">
            <Sidebar />
          </aside>
          {/*<PageTransition>*/}
          <main className="flex w-full flex-1 flex-col overflow-auto">{children}</main>
          {/*</PageTransition>*/}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
