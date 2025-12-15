import { useCallback } from "react";
import { NavigationMenuComponent } from "@/components/navigation/NavigationMenu";
import { SearchApp } from "@/components/search/SearchApp";
import { menuLinks, siteConfig } from "@/site.config";
import { homeUrl, url } from "@/utils/url";

import "@/components/navigation/navigation-menu.css";

type HardwareStatus =
  | "available"
  | "in-progress"
  | "coming-soon"
  | "deprecated";
type SoftwareStatus =
  | "stable"
  | "beta"
  | "alpha"
  | "in-progress"
  | "deprecated";

type HardwareItem = {
  id: string;
  name: string;
  shortDescription: string;
  status: HardwareStatus;
};

type SoftwareItem = {
  id: string;
  name: string;
  shortDescription: string;
  status: SoftwareStatus;
};

type ResearchItem = {
  id: string;
  title: string;
  type: string;
  year?: number;
};

export type HeaderProps = {
  currentPath: string;
  hardwareItems: HardwareItem[];
  softwareItems: SoftwareItem[];
  researchItems: ResearchItem[];
};

const menuSections = {
  "/projects/": [
    { title: "Hardware Projects", href: "/projects/#hardware" },
    { title: "Software Projects", href: "/projects/#software" },
    { title: "Research Projects", href: "/projects/#research" },
  ],
  "/services/": [
    { title: "Hardware Services", href: "/services/#hardware" },
    { title: "Software Services", href: "/services/#software" },
    { title: "Research Services", href: "/services/#research" },
    { title: "Benefits", href: "/services/#benefits" },
    { title: "Process", href: "/services/#process" },
    { title: "Get Started", href: "/services/#get-started" },
  ],
  "/events/": [
    { title: "Featured Events", href: "/events/#featured" },
    { title: "Upcoming Events", href: "/events/#upcoming" },
    { title: "Past Events", href: "/events/#past" },
    { title: "Partner for an Event", href: "/events/#events-contribute" },
  ],
  "/contributors/": [
    { title: "People", href: "/contributors/#people" },
    { title: "Partners", href: "/contributors/#partners" },
    { title: "Sponsors", href: "/contributors/#sponsors" },
  ],
};

export default function Header({
  currentPath,
  hardwareItems,
  softwareItems,
  researchItems,
}: HeaderProps) {
  const urlPrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const handleThemeToggle = useCallback(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    const ev = new CustomEvent("theme-change", {
      detail: { theme: isDark ? "light" : "dark" },
    });
    document.dispatchEvent(ev);
  }, []);

  return (
    <header
      id="main-header"
      className="fixed left-0 right-0 z-50 lg:sticky top-0 h-[72px] w-full bg-surface/80 backdrop-blur-xl lg:bg-surface/85 lg:backdrop-blur-lg border-b border-accent-base/10 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3)]"
    >
      <div className="md:hidden absolute top-0 left-1/2 -ml-[50vw] w-screen min-h-screen pointer-events-none blur-2xl">
        <div className="absolute top-[-90%] right-[25%] w-[75%] h-full bg-linear-to-b from-orange-500 via-amber-400 to-transparent rounded-full opacity-40 dark:opacity-5" />
        <div className="absolute top-[-90%] left-[25%] w-[75%] h-full bg-linear-to-b from-amber-400 via-teal-400 to-transparent rounded-full opacity-40 dark:opacity-5" />
        <div className="absolute top-[-85%] right-[25%] w-[55%] h-full bg-linear-to-b from-teal-400 via-orange-500 to-transparent rounded-full opacity-40 dark:opacity-5" />
        <div className="absolute top-[-85%] left-[25%] w-[55%] h-full bg-linear-to-b from-orange-500 via-amber-400 to-transparent rounded-full opacity-40 dark:opacity-5" />
        <div className="absolute top-[-75%] left-[-25%] w-[65%] h-full bg-linear-to-b from-teal-400 via-amber-400 to-transparent rounded-full opacity-30 dark:opacity-5" />
        <div className="absolute top-[-75%] right-[-25%] w-[65%] h-full bg-linear-to-b from-amber-400 via-teal-400 to-transparent rounded-full opacity-30 dark:opacity-5" />
        <div className="absolute top-[-85%] left-[-30%] w-[85%] h-full bg-linear-to-b from-orange-500 via-teal-400 to-transparent rounded-full opacity-60 dark:opacity-5" />
        <div className="absolute top-[-85%] right-[-30%] w-[85%] h-full bg-linear-to-b from-teal-400 via-orange-500 to-transparent rounded-full opacity-60 dark:opacity-5" />
      </div>

      <div className="w-full h-full xl:max-w-6xl xl:mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <a
          aria-label={siteConfig.title}
          aria-current={currentPath === "/" ? "page" : undefined}
          className="group flex items-center sm:relative h-8 w-8 md:p-2 rounded-lg justify-center hover:bg-accent-base/10 transition-colors lg:w-auto lg:justify-start"
          href={homeUrl()}
        >
          <div title={siteConfig.title}>
            <img src="/brand.svg" className="size-5" />
          </div>
          <strong className="max-[320px]:hidden lowercase text-base hidden lg:block z-10 mb-0.5 ms-2 lg:text-base xl:text-xl hover:opacity-90 whitespace-nowrap">
            {siteConfig.title}
          </strong>
        </a>

        <nav className="hidden md:flex ml-auto mr-2 lg:mr-6 items-center">
          <NavigationMenuComponent
            currentPath={currentPath}
            menuLinks={menuLinks}
            hardwareItems={hardwareItems}
            softwareItems={softwareItems}
            researchItems={researchItems}
            menuSections={menuSections}
            urlPrefix={urlPrefix}
          />
        </nav>

        <div className="flex items-center gap-x-1 md:gap-x-2">
          <div
            id="buttons-panel"
            className="hidden md:flex space-x-1 md:space-x-2"
          >
            <button
              className="hidden md:flex relative items-center justify-center select-none rounded-lg transition-colors bg-color-100 text-accent-base hover:bg-accent-base/10 focus:outline-2 focus:outline-accent-two outline-offset-2 h-8 w-8"
              type="button"
              aria-label="Toggle theme"
              onClick={handleThemeToggle}
            >
              <svg
                aria-hidden="true"
                className="absolute w-5 h-5 opacity-100 scale-100 transition-all dark:opacity-0 dark:scale-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="19"
                  x2="12"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="12"
                  x2="5"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="19"
                  y1="12"
                  x2="22"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="4.22"
                  y1="4.22"
                  x2="6.34"
                  y2="6.34"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="17.66"
                  y1="17.66"
                  x2="19.78"
                  y2="19.78"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="17.66"
                  y1="6.34"
                  x2="19.78"
                  y2="4.22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="4.22"
                  y1="19.78"
                  x2="6.34"
                  y2="17.66"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                aria-hidden="true"
                className="absolute w-5 h-5 opacity-0 scale-0 transition-all dark:opacity-100 dark:scale-100"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                ></path>
              </svg>
            </button>
          </div>

          <SearchApp
            menuLinks={menuLinks}
            currentPath={currentPath}
            urlPrefix={urlPrefix}
            menuSections={menuSections}
          />
        </div>
      </div>
    </header>
  );
}
