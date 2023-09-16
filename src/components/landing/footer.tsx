import { DarkModeSwitch } from "../ui/dark-mode-switch";
import { Icon } from "../ui/icons";

export function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="relative">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
        <div className="border-t border-black border-opacity-10 dark:border-white dark:border-opacity-10 pt-8 flex flex-col md:flex-row items-center gap-4 md:justify-between">
          <div className="flex items-center gap-4 md:order-2">
            <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:twitter" className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:github" className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:instagram" className="w-7 h-7" />
            </a>
            <DarkModeSwitch />
          </div>
          <p className="text-center text-xs leading-5">
            © 2023 KBaseBot, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
