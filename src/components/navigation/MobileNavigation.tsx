import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";
import { CallToActionButton } from "../ui/CallToActionButton";
import { NavIconButton } from "./NavIconButton";
import { useSearch } from "@/components/search";
import { navIconMap } from "@/components/navigation/navIcons";
import { url as buildUrl } from "@/utils/url";
import type { LinkSection, Section } from "@/site.config";

interface MobileNavigationProps {
  menuLinks: Array<{
    path: string;
    title: string;
    inHeader: boolean;
    callToAction?: boolean;
    sections?: Section[];
  }>;
  currentPath: string;
  urlPrefix?: string;
}

// Helper function to construct URLs
const makeUrl = (path: string, prefix: string = "") =>
  buildUrl(path, prefix || import.meta.env.BASE_URL);

// Hamburger menu icon
const HamburgerIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1={3}
      y1={6}
      x2={21}
      y2={6}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={3}
      y1={12}
      x2={21}
      y2={12}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={3}
      y1={18}
      x2={21}
      y2={18}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

// Close (X) icon
const CloseIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1={6}
      y1={6}
      x2={18}
      y2={18}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <line
      x1={18}
      y1={6}
      x2={6}
      y2={18}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  menuLinks,
  currentPath,
  urlPrefix = "",
}) => {
  const [open, setOpen] = React.useState(false);

  const { query, setQuery, results, loading } = useSearch();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const toggleSection = (path: string) =>
    setOpenSection((prev) => (prev === path ? null : path));
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (open && searchOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, searchOpen]);

  const url = (path: string) => makeUrl(path, urlPrefix);
  const getLinkSections = (sections?: Section[]) =>
    (sections ?? []).filter(
      (section): section is LinkSection => section.kind === "link",
    );
  const getCurrentPageName = () => {
    if (currentPath === "/" || currentPath === "") return "Home";
    const exact = menuLinks.find((m) => m.path === currentPath);
    if (exact?.title) return exact.title;
    const prefix = menuLinks.find((m) => currentPath.startsWith(m.path));
    if (prefix?.title) return prefix.title;
    const seg = currentPath.split("/").filter(Boolean)[0] || "";
    return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : "Home";
  };
  const currentPageName = getCurrentPageName();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSearchOpen(false);
          setQuery("");
        }
      }}
    >
      <div className="md:hidden ml-auto flex items-center gap-2">
        <span className="text-sm font-medium text-foreground/80 truncate max-w-[40vw] text-right">
          {currentPageName}
        </span>
        <Dialog.Trigger asChild>
          <NavIconButton label="Open navigation menu">
            <HamburgerIcon />
          </NavIconButton>
        </Dialog.Trigger>
      </div>

      <AnimatePresence>
        {open && (
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-surface/80 backdrop-blur-xl lg:bg-surface/85 lg:backdrop-blur-lg z-50 focus:outline-none overflow-hidden flex flex-col shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-linear-to-b from-orange-500 via-amber-400 to-transparent rounded-full opacity-20 dark:opacity-10 blur-3xl" />
                  <div className="absolute bottom-[-40%] left-[-20%] w-[60%] h-[60%] bg-linear-to-t from-teal-400 via-amber-400 to-transparent rounded-full opacity-20 dark:opacity-10 blur-3xl" />
                </div>

                <div className="relative flex h-full flex-col">
                  <Dialog.Title className="sr-only">
                    Navigation menu
                  </Dialog.Title>
                  {/* Header */}
                  <motion.div
                    className="flex items-center justify-between h-[72px] px-4 py-2 border-b border-accent-base/10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div
                      className="mr-2 overflow-hidden"
                      initial={false}
                      animate={{
                        width: searchOpen ? "100%" : 0,
                        opacity: searchOpen ? 1 : 0,
                      }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 300,
                      }}
                    >
                      {searchOpen ? (
                        <div className="relative">
                          <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search..."
                            className="h-10 w-full rounded-lg border-none bg-color-100 px-3 text-base text-foreground outline-none placeholder:opacity-60"
                            aria-label="Search query"
                          />
                        </div>
                      ) : null}
                    </motion.div>

                    <div className="ml-auto flex items-center gap-2">
                      {/* Search button - toggle header search field */}
                      {!searchOpen && (
                        <NavIconButton
                          label="Open search"
                          onClick={() => {
                            setSearchOpen(true);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="11"
                              cy="11"
                              r="7"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <line
                              x1="16.65"
                              y1="16.65"
                              x2="21"
                              y2="21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </NavIconButton>
                      )}

                      {/* Theme toggle button - dispatches 'theme-change' event */}
                      {!searchOpen && (
                        <NavIconButton
                          label="Toggle theme"
                          onClick={() => {
                            const root = document.documentElement;
                            const isDark =
                              root.getAttribute("data-theme") === "dark";
                            const themeChangeEvent = new CustomEvent(
                              "theme-change",
                              {
                                detail: { theme: isDark ? "light" : "dark" },
                              },
                            );
                            document.dispatchEvent(themeChangeEvent);
                          }}
                        >
                          {/* Sun (shown in light mode) */}
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
                          {/* Moon (shown in dark mode) */}
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
                            />
                          </svg>
                        </NavIconButton>
                      )}

                      <NavIconButton
                        label="Close navigation"
                        onClick={() => {
                          const hasQuery = (query ?? "").trim().length > 0;
                          if (searchOpen && hasQuery) {
                            // Clear query and keep search field visible; menu remains until user types
                            setQuery("");
                          } else {
                            // Close dialog and fully reset search state
                            setSearchOpen(false);
                            setQuery("");
                            setOpen(false);
                          }
                        }}
                      >
                        <CloseIcon />
                      </NavIconButton>
                    </div>
                  </motion.div>

                  {/* Navigation Items or Search Results */}
                  {searchOpen && (query ?? "").trim().length > 0 ? (
                    <div className="flex-1 overflow-y-auto p-4">
                      {loading && (
                        <div className="px-2 py-3 text-sm text-color-600 dark:text-color-400">
                          Searching…
                        </div>
                      )}
                      {!loading &&
                        (query ?? "").trim().length > 0 &&
                        results.length === 0 && (
                          <div className="px-2 py-3 text-sm text-color-600 dark:text-color-400">
                            No results
                          </div>
                        )}
                      {!loading && results.length > 0 && (
                        <motion.ul
                          className="space-y-2"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: {
                                staggerChildren: 0.05,
                                delayChildren: 0.2,
                              },
                            },
                          }}
                        >
                          {results.map((r, idx) => (
                            <motion.li
                              key={`${r.url}-${idx}`}
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 },
                              }}
                            >
                              <a
                                href={r.url}
                                className="block rounded-lg px-3 py-2 transition-colors hover:bg-accent-base/5 text-foreground"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="font-medium">{r.title}</div>
                                  {r.type && (
                                    <span className="text-xs text-color-600 dark:text-color-400">
                                      {r.type}
                                    </span>
                                  )}
                                </div>
                                {r.description && (
                                  <div className="mt-0.5 line-clamp-2 text-sm text-color-600 dark:text-color-400">
                                    {r.description}
                                  </div>
                                )}
                              </a>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  ) : (
                    <nav className="flex-1 overflow-y-auto p-4">
                      <motion.ul
                        className="space-y-2"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.05,
                              delayChildren: 0.2,
                            },
                          },
                        }}
                      >
                        {menuLinks
                          .filter((link) => link.inHeader)
                          .map((link) => (
                            <motion.li
                              key={link.path}
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 },
                              }}
                            >
                              {(() => {
                                const linkSections = getLinkSections(
                                  link.sections,
                                );
                                const hasSections = linkSections.length > 0;
                                return link.callToAction ? (
                                  <CallToActionButton
                                    href={url(link.path)}
                                    size="medium"
                                    variant="tertiary"
                                    fullWidth
                                    className="text-center"
                                  >
                                    {link.title}
                                  </CallToActionButton>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={url(link.path)}
                                        className={clsx(
                                          "flex-1 block px-4 py-3 rounded-lg transition-all duration-200",
                                          currentPath === link.path
                                            ? "bg-accent-base/10 text-accent-three font-semibold"
                                            : "text-foreground hover:bg-accent-base/5 hover:text-accent-base",
                                        )}
                                      >
                                        <span className="flex items-center gap-2">
                                          {(() => {
                                            const IconComponent =
                                              navIconMap[link.path];
                                            return IconComponent ? (
                                              <IconComponent className="w-4 h-4 text-accent-base" />
                                            ) : null;
                                          })()}
                                          <span>{link.title}</span>
                                        </span>
                                      </a>
                                      {hasSections && (
                                        <button
                                          type="button"
                                          aria-label={`Toggle sections for ${link.title}`}
                                          onClick={() =>
                                            toggleSection(link.path)
                                          }
                                          className={clsx(
                                            "inline-flex items-center justify-center h-8 w-8 rounded-lg bg-color-100 text-accent-base hover:bg-accent-base/10 transition-colors focus:outline-2 focus:outline-accent-three outline-offset-2",
                                            openSection === link.path &&
                                              "bg-accent-base/10",
                                          )}
                                        >
                                          <svg
                                            className={clsx(
                                              "h-4 w-4 transition-transform",
                                              openSection === link.path
                                                ? "rotate-180"
                                                : "rotate-0",
                                            )}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    {openSection === link.path &&
                                      hasSections && (
                                        <motion.ul
                                          className="mt-2 ml-4 space-y-1"
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{
                                            opacity: 1,
                                            height: "auto",
                                          }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          {linkSections.map((section) => (
                                            <li key={section.href}>
                                              <a
                                                href={url(section.href)}
                                                className="block px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent-base/5 hover:text-accent-base transition-colors"
                                              >
                                                {section.title}
                                              </a>
                                            </li>
                                          ))}
                                        </motion.ul>
                                      )}
                                  </>
                                );
                              })()}
                            </motion.li>
                          ))}
                      </motion.ul>
                    </nav>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
