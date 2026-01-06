import React from "react";
import { clsx } from "clsx";
import { getNavHighlightClasses } from "@/components/navigation/navVariant";

export interface MobileNavButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Accessible label for screen readers. Applied to aria-label and defaults title to this value.
   */
  label: string;
  /**
   * The icon or content to render inside the button (usually an SVG).
   */
  children: React.ReactNode;
  /**
   * Visual size preset. 'md' matches 32px, 'lg' matches 36px.
   */
  size?: "md" | "lg";
  /**
   * When true, applies the "active" visual state (e.g., for toggles).
   */
  active?: boolean;
  /**
   * Optional additional classes to merge with the base styles.
   */
  className?: string;
}

/**
 * MobileNavButton
 *
 * Standardized, accessible icon-only button for mobile navigation controls.
 * Reuse this for:
 * - Hamburger trigger (in the main header)
 * - Search, Theme, and Close buttons in the mobile dialog header
 *
 * Usage examples:
 *  <MobileNavButton label="Open navigation" className="md:hidden">
 *    <HamburgerIcon />
 *  </MobileNavButton>
 *
 *  <Dialog.Close asChild>
 *    <MobileNavButton label="Close navigation">
 *      <CloseIcon />
 *    </MobileNavButton>
 *  </Dialog.Close>
 */
export const MobileNavButton = React.forwardRef<
  HTMLButtonElement,
  MobileNavButtonProps
>(function MobileNavButton(
  { label, children, size = "md", active = false, className, title, type, ...rest },
  ref,
) {
  const sizeClasses =
    size === "lg" ? "h-9 w-9" : "h-8 w-8"; // default md -> 32px, lg -> 36px
  const navHighlight = getNavHighlightClasses();

  const baseClasses = clsx(
    "relative inline-flex items-center justify-center select-none",
    "rounded-lg transition-colors",
    "bg-color-100 text-accent-base hover:bg-accent-base/10",
    "focus:outline-2 outline-offset-2",
    navHighlight.focusOutline,
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses,
    active && clsx("bg-accent-base/10", navHighlight.text),
    className,
  );

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      aria-label={label}
      title={title ?? label}
      className={baseClasses}
      data-active={active ? "true" : "false"}
      {...rest}
    >
      {children}
    </button>
  );
});
