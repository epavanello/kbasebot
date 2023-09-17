import { DarkModeSwitch } from "../ui/dark-mode-switch";
import { Icon } from "../ui/icons";
import Link from "next/link";

export function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="relative">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
        <div className="border-t border-black border-opacity-10 dark:border-white dark:border-opacity-10 pt-8 flex flex-col md:flex-row items-center gap-4 md:justify-between">
          <div className="flex items-center gap-4 md:order-2">
          <a
              target="_blank"
              href="https://twitter.com/kbasebot"
              className="text-gray-500 hover:opacity-50"
            >
              <Icon icon="mdi:twitter" className="w-6 h-6" />
            </a>
            <a
              target="_blank"
              href="mailto:hello@kbasebot.com"
              className="text-gray-500 hover:opacity-50"
            >
              <Icon icon="line-md:email-opened" className="w-6 h-6" />
            </a>
            {/* <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:github" className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:opacity-50">
              <Icon icon="mdi:instagram" className="w-7 h-7" />
            </a> */}
            <DarkModeSwitch />
          </div>
          <p className="text-center text-xs leading-5">
            © 2023 KBaseBot, Inc. All rights reserved.
          </p>
          <ul className="xl:flex lg:flex md:flex sm:flex justify-around">
            <li className="text-gray-800 dark:text-white hover:text-gray-900 mb-3 xl:mb-0 lg:mb-0 md:mb-0 sm:mb-0">
              <Link
                className="focus:outline-none focus:underline hover:text-gray-500 text-sm"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
