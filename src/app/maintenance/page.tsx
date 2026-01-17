import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Discontinued - KBaseBot",
  description: "KBaseBot is no longer available as a managed SaaS service",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            KBaseBot
          </h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
        </div>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
            Service No Longer Available
          </p>

          <p className="text-lg">
            This service is no longer available as a managed SaaS due to lack of customers.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Good news! KBaseBot is now open source.
            </p>
            <a
              href="https://github.com/epavanello/kbasebot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-base">
              Need help or have questions?
            </p>
            <a
              href="mailto:hi@emadev.co"
              className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-lg transition-colors duration-200"
            >
              hi@emadev.co
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
