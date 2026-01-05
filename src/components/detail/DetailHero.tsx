import type React from "react";
import { FeaturedStar, type FeaturedState } from "@/components/ui/FeaturedStar";
import { Avatar, type AvatarType } from "@/components/ui/Avatar";
import type { ImageLike } from "@/utils/images";
import clsx from "clsx";

export interface DetailHeroBadge {
  text: string;
  color?:
    | "green"
    | "blue"
    | "orange"
    | "red"
    | "yellow"
    | "gray"
    | "accent"
    | "special";
  variant?: "solid" | "outline";
  priority?: number; // Higher priority badges show first on mobile
}

export interface DetailHeroProps {
  image?: ImageLike;
  title: string;
  subtitle?: string;
  badges?: DetailHeroBadge[];
  featuredState?: FeaturedState;
  overlayGradient?: boolean;
  className?: string;
  showBadgesOnMobile?: boolean;
  mobileBadgeLimit?: number; // Max number of badges to show on mobile
  // Avatar/logo props
  logo?: ImageLike;
  avatar?: ImageLike;
  thumbnail?: ImageLike;
  logoText?: string;
  showFallbackAvatar?: boolean;
  logoBackdrop?: boolean;
  entityType?:
    | "person"
    | "organization"
    | "hardware"
    | "software"
    | "research"
    | "event";
}

export const DetailHero: React.FC<DetailHeroProps> = ({
  image,
  title,
  subtitle,
  badges = [],
  featuredState = "not-featured",
  overlayGradient = true,
  className = "",
  showBadgesOnMobile = false,
  mobileBadgeLimit = 2,
  logo,
  avatar,
  thumbnail,
  logoText,
  showFallbackAvatar = true,
  logoBackdrop = false,
  entityType = "organization",
}) => {
  const getBadgeClasses = (badge: DetailHeroBadge) => {
    const baseClasses =
      "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm";

    const colorClasses = {
      green: "bg-green-500/80 text-white dark:text-white",
      blue: "bg-blue-500/80 text-white dark:text-white",
      orange: "bg-orange-500/80 text-white dark:text-white",
      red: "bg-red-500/80 text-white dark:text-white",
      yellow: "bg-yellow-500/80 text-white dark:text-white",
      gray: "bg-neutral-500/80 text-white dark:text-white",
      accent: "bg-accent-two/80 text-white dark:text-white",
      special: "bg-special/80 text-white dark:text-white",
    };

    if (badge.variant === "outline") {
      const outlineColors = {
        green:
          "border-2 border-green-500 text-green-600 dark:text-green-400 bg-white/10 dark:bg-black/10",
        blue: "border-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white/10 dark:bg-black/10",
        orange:
          "border-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-white/10 dark:bg-black/10",
        red: "border-2 border-red-500 text-red-600 dark:text-red-400 bg-white/10 dark:bg-black/10",
        yellow:
          "border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-white/10 dark:bg-black/10",
        gray: "border-2 border-neutral-500 text-neutral-600 dark:text-neutral-400 bg-white/10 dark:bg-black/10",
        accent:
          "border-2 border-accent-two text-accent-two bg-white/10 dark:bg-black/10",
        special:
          "border-2 border-special text-special bg-white/10 dark:bg-black/10",
      };
      return `${baseClasses} ${outlineColors[badge.color || "accent"]}`;
    }

    return `${baseClasses} ${colorClasses[badge.color || "accent"]}`;
  };

  const extractSrc = (value?: ImageLike) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.src;
  };

  const extractAlt = (value?: ImageLike, fallback?: string) => {
    if (
      value &&
      typeof value === "object" &&
      "alt" in value &&
      value.alt !== undefined
    ) {
      return value.alt;
    }
    return fallback;
  };

  const imageSrc = extractSrc(image);
  const imageAlt = extractAlt(image, title) ?? title;

  // Determine which avatar/logo to use
  const profileImage = avatar || logo || thumbnail;
  const showProfileImage =
    Boolean(profileImage) || (!image && showFallbackAvatar);

  // Map entity type to avatar type
  const avatarTypeMap: Record<string, AvatarType> = {
    person: "person",
    organization: "organization",
    hardware: "hardware",
    software: "software",
    research: "research",
    event: "event",
  };
  const avatarType = avatarTypeMap[entityType] || "organization";

  const avatarWrapperClassName = logoBackdrop
    ? "rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-md"
    : "";

  return (
    <div
      className={`relative mb-8 -mx-4 md:-mx-8 rounded-none md:rounded-xl overflow-hidden ${className}`}
    >
      <div className="aspect-4/3 sm:aspect-video md:aspect-21/9 overflow-hidden relative">
        {image ? (
          <>
            {/* Image background */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay gradient for images */}
            {overlayGradient && (
              <div className="absolute inset-0 bg-linear-to-t from-surface/95 via-surface/60 to-transparent" />
            )}
          </>
        ) : (
          <>
            {/* Gradient fallback background */}
            <div className="absolute inset-0 bg-linear-to-br from-special-lighter via-special-light to-special" />

            {/* Overlay for text readability on gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-surface/95 via-surface/60 to-surface/20" />
          </>
        )}

        {/* Content overlay - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto flex items-end gap-2 sm:gap-4 md:gap-6">
            {/* Avatar/Logo - responsive sizing */}
            {showProfileImage && (
              <div className="shrink-0">
                <Avatar
                  src={profileImage}
                  alt={title}
                  name={logoText ?? title}
                  type={avatarType}
                  size="2xl"
                  rounded="full"
                  className={clsx(
                    "w-14! h-14! sm:w-20! sm:h-20! md:w-24! md:h-24! lg:w-32! lg:h-32!",
                    avatarWrapperClassName,
                  )}
                />
              </div>
            )}

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-accent-base mb-1 sm:mb-2 leading-tight">
                <span className="inline-flex items-center gap-2 sm:gap-3 flex-wrap">
                  {title}
                </span>
              </h1>

              {subtitle && (
                <p className="text-xs sm:text-base md:text-lg text-accent-base/90 mb-2 sm:mb-3 max-w-3xl line-clamp-2 sm:line-clamp-none">
                  {subtitle}
                </p>
              )}

              {badges.length > 0 && (
                <>
                  {/* Mobile badges - limited display */}
                  <div
                    className={`${showBadgesOnMobile ? "flex" : "hidden"} sm:hidden gap-1 flex-wrap items-center`}
                  >
                    {(featuredState === "featured" ||
                      featuredState === "previously-featured") && (
                      <FeaturedStar
                        state={featuredState}
                        size="md"
                        glow
                        className="shrink-0 inline-block"
                      />
                    )}
                    {badges
                      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                      .slice(0, mobileBadgeLimit)
                      .map((badge) => (
                        <span
                          key={`${badge.text}-${badge.priority ?? ""}`}
                          className={getBadgeClasses(badge)}
                        >
                          {badge.text}
                        </span>
                      ))}
                    {badges.length > mobileBadgeLimit && (
                      <span className="text-xs text-accent-base/60">
                        +{badges.length - mobileBadgeLimit}
                      </span>
                    )}
                  </div>

                  {/* Desktop badges - all displayed */}
                  <div className="hidden sm:flex gap-2 flex-wrap items-center">
                    {(featuredState === "featured" ||
                      featuredState === "previously-featured") && (
                      <FeaturedStar
                        state={featuredState}
                        size="lg"
                        glow
                        className="shrink-0 inline-block"
                      />
                    )}
                    {badges.map((badge) => (
                      <span
                        key={`${badge.text}-${badge.priority ?? ""}`}
                        className={getBadgeClasses(badge)}
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
