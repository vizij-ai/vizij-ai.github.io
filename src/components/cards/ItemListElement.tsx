import type { FC } from "react";
import { FeaturedStar, type FeaturedState } from "@/components/ui/FeaturedStar";
import { Avatar, type AvatarType } from "@/components/ui/Avatar";
import type { ImageLike } from "@/utils/images";
import { isExternalUrl, url as buildUrl } from "@/utils/url";

export interface ItemListElementProps {
  title: string;
  description?: string;
  href: string;
  // Use the same shape as ItemCard's logo/image props
  logo?: ImageLike;
  imageAlt?: string;
  logoBackdrop?: boolean;
  featuredState?: FeaturedState;
  type?:
    | "hardware"
    | "software"
    | "people"
    | "organizations"
    | "research"
    | "events";
  // Optional right-side meta text (e.g., role, category) shown next to featured indicator
  meta?: string;
  className?: string;
  // If true, hide description on smaller screens
  hideDescriptionOnCompact?: boolean;
  // Alignment for description text: "left" or "right"
  secondaryAlign?: "left" | "right";
}

/**
 * A list-friendly alternative to ItemCard for compact row rendering.
 * Layout:
 * - Left: Avatar/Logo
 * - Middle: Title (name) and one-line description (ellipsized)
 * - Right: Meta (optional) and FeaturedStar indicator
 *
 * Visual styling is aligned with ItemCard: background, rounded corners, hover effects.
 */
export const ItemListElement: FC<ItemListElementProps> = ({
  title,
  description,
  href,
  logo,
  imageAlt,
  logoBackdrop = false,
  featuredState = "not-featured",
  type = "hardware",
  meta,
  hideDescriptionOnCompact = false,
  secondaryAlign = "left",
  className = "",
}) => {
  // Map item type to avatar type for consistent visuals
  const typeToAvatarType: Record<string, AvatarType> = {
    hardware: "hardware",
    software: "software",
    people: "person",
    organizations: "organization",
    research: "research",
    events: "event",
  };
  const avatarType = typeToAvatarType[type] || "organization";
  const resolvedHref = isExternalUrl(href) ? href : buildUrl(href);
  const avatarBackdropClassName = logoBackdrop
    ? "rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-md"
    : "";

  return (
    <a
      href={resolvedHref}
      className={`group flex items-center gap-3 sm:gap-4 bg-special-lighter rounded-lg hover:shadow-lg transition-[colors,transform] w-full overflow-hidden no-underline px-3 sm:px-4 py-2.5 scale-100 hover:scale-[1.02] backdrop-blur-lg ${className}`}
    >
      {/* Avatar / Logo */}
      <div className="shrink-0">
        <Avatar
          src={logo}
          alt={imageAlt || title}
          name={type === "people" ? title : undefined}
          type={avatarType}
          size="md"
          className={avatarBackdropClassName}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="block">
          <h3 className="font-semibold text-accent-base group-hover:text-accent-two transition-colors truncate text-sm sm:text-base">
            {title}
          </h3>
        </div>
        {description && (
          <p
            className={`text-xs sm:text-sm text-color-600 dark:text-color-400 truncate ${secondaryAlign === "right" ? "text-right" : "text-left"} ${hideDescriptionOnCompact ? "hidden sm:block" : ""}`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Right-side indicators */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {meta && (
          <span className="text-xs text-color-600 dark:text-color-400 hidden sm:inline-block">
            {meta}
          </span>
        )}
        <FeaturedStar state={featuredState} size="md" />
      </div>
    </a>
  );
};

export default ItemListElement;
