import { DarkModeSwitch } from "../ui/dark-mode-switch";
import { Icon } from "../ui/icons";
import Link from "next/link";

export function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="relative">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
        <div className="flex flex-col items-center gap-4 border-t border-black border-opacity-10 pt-8 dark:border-white dark:border-opacity-10 md:flex-row md:justify-between">
          <div className="flex items-center gap-4 md:order-2">
            <a target="_blank" href="https://twitter.com/kbasebot" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:twitter" className="h-6 w-6" />
            </a>
            <a target="_blank" href="mailto:hello@kbasebot.com" className="text-gray-500 hover:opacity-50">
              <Icon icon="line-md:email-opened" className="h-6 w-6" />
            </a>
            {/* <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:github" className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:instagram" className="w-7 h-7" />
            </a> */}
            <DarkModeSwitch />
          </div>
          <p className="text-center text-xs leading-5">© 2023 KBaseBot, Inc. All rights reserved.</p>
          <ul className="justify-around sm:flex md:flex lg:flex xl:flex">
            <li className="mb-3 text-gray-800 hover:text-gray-900 dark:text-white sm:mb-0 md:mb-0 lg:mb-0 xl:mb-0">
              <Link className="text-sm hover:text-gray-500 focus:underline focus:outline-none" href="/privacy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
