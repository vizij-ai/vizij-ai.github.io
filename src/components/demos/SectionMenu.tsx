import { useActiveSectionId } from "@/demo-lib/useActiveSectionId";
import { clsx } from "clsx";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SectionMenuItem = {
  id: string;
  label: string;
};

type SectionMenuProps = {
  sections: SectionMenuItem[];
};

export function SectionMenu({ sections }: SectionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleId = useId();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );
  const activeSectionId = useActiveSectionId(sectionIds);
  const activeLabel =
    sections.find((section) => section.id === activeSectionId)?.label ??
    sections[0]?.label ??
    "Sections";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        target &&
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen]);

  const handleNavigate = (sectionId: string) => {
    setIsOpen(false);
    const node = document.getElementById(sectionId);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-[55] bg-[#1b1915]/32 backdrop-blur-[3px] dark:bg-[#090a0d]/54"
          role="presentation"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col-reverse items-end gap-3 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-10">
        <button
          id={toggleId}
          ref={buttonRef}
          type="button"
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[#e7dac9] bg-white/94 px-4 py-2.5 text-sm font-semibold text-[#201913] shadow-[0_18px_40px_-24px_rgba(24,24,27,0.32)] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#17191e]/92 dark:text-[#f4ede3]"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="flex h-4 w-5 flex-col justify-between" aria-hidden>
            <span
              className={clsx(
                "h-0.5 rounded-full bg-current transition-transform",
                isOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={clsx(
                "h-0.5 rounded-full bg-current transition-opacity",
                isOpen && "opacity-0",
              )}
            />
            <span
              className={clsx(
                "h-0.5 rounded-full bg-current transition-transform",
                isOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#7c6d5d] dark:text-[#b9afa2]">
            Sections
          </span>
          <span>{activeLabel}</span>
        </button>

        <nav
          id={panelId}
          aria-labelledby={toggleId}
          aria-label="Demo sections"
          className={clsx(
            "pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-[1.75rem] border border-[#e7dac9] bg-white/96 p-5 text-[#201913] shadow-[0_24px_64px_-28px_rgba(24,24,27,0.36)] transition-all dark:border-white/10 dark:bg-[#17191e]/96 dark:text-[#f4ede3]",
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
          ref={panelRef}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c6d5d] dark:text-[#b9afa2]">
            Jump to
          </p>
          <ul className="mt-3 flex list-none flex-col gap-1 p-0">
            {sections.map((section, index) => {
              const isActive = section.id === activeSectionId;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    className={clsx(
                      "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                      isActive
                        ? "bg-[#f2e6d7] text-[#201913] dark:bg-white/10 dark:text-[#f4ede3]"
                        : "text-[#201913] hover:bg-[#f7efe4] dark:text-[#f4ede3] dark:hover:bg-white/6",
                    )}
                    onClick={() => handleNavigate(section.id)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d7b68] dark:text-[#b9afa2]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold">
                        {section.label}
                      </span>
                    </span>
                    <span
                      className={clsx(
                        "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                        isActive
                          ? "border-[#f0b36b] bg-[#fff3e5] text-[#b95a14] dark:border-[#f0b36b]/35 dark:bg-[#2b2014] dark:text-[#ffd298]"
                          : "border-[#eadbc8] bg-[#fbf5ec] text-[#8d7b68] dark:border-white/10 dark:bg-[#1d2129] dark:text-[#b9afa2]",
                      )}
                    >
                      {isActive ? "Now" : "Go"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
