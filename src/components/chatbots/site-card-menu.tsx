import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/router";
import { EyeIcon, MoreVertical, PencilIcon } from "lucide-react";
import { getSitePublicUrl } from "@/lib/utils";

const SiteCardMenu = ({ site, page, domains }) => {
  const { push } = useRouter();
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="border-none px-1 cursor-pointer">
          <MoreVertical size={18} />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            className="cursor-pointer"
            onSelect={() =>
              push(`/app/sites/${site.id}/pages/${page?.id}/edit`)
            }
          >
            <PencilIcon size={18} className="mr-2" /> Edit
          </MenubarItem>
          {/*<MenubarItem onSelect={()=> push(`/app/${site.id}`)}>Edit</MenubarItem>*/}
          <MenubarSeparator />
          <MenubarItem className="cursor-pointer" asChild>
            <a href={getSitePublicUrl(domains)} target="_blank">
              <EyeIcon size={18} className="mr-2" /> Preview as public
            </a>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default SiteCardMenu;
