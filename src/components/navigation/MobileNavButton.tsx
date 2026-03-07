import React from "react";
import { clsx } from "clsx";
import {
  getNavHighlightClasses,
  resolveNavHighlightVariant,
} from "@semio-community/ecosystem-site-core";
import { siteConfig } from "@/site.config";

export interface MobileNavButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  children: React.ReactNode;
  size?: "md" | "lg";
  active?: boolean;
  className?: string;
}

const navHighlight = getNavHighlightClasses(
  resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);

export const MobileNavButton = React.forwardRef<
  HTMLButtonElement,
  MobileNavButtonProps
>(function MobileNavButton(
  { label, children, size = "md", active = false, className, title, type, ...rest },
  ref,
) {
  const sizeClasses = size === "lg" ? "h-9 w-9" : "h-8 w-8";

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
