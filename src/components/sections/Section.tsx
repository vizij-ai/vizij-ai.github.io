import React from "react";

export type SectionVariant = "primary" | "secondary" | "tertiary" | "default";

export interface SectionProps {
  title?: string;
  subtitle?: string;
  image?: {
    src: string;
    alt?: string;
  };
  variant?: SectionVariant;
  className?: string;
  id?: string;
  ariaLabel?: string;
  html?: string;
  children?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  image,
  variant = "primary",
  className = "",
  id,
  ariaLabel,
  html,
  children,
}) => {
  const textClass =
    {
      primary: "text-accent-two",
      secondary: "text-accent-one",
      tertiary: "text-accent-three",
      default: "text-accent-base",
    }[variant] || "text-accent-base";

  const textClassSubtitle =
    {
      primary: "text-accent-base/70",
      secondary: "text-accent-base/70",
      tertiary: "text-accent-base/70",
      default: "text-accent-base/70",
    }[variant] || "text-accent-base/70";

  const outerPadding = !image ? "py-8 sm:py-10" : "";
  const innerPadding = image ? "py-8 sm:py-10" : "";

  // Anchor target for the section link
  const anchorId = id ?? title;

  return (
    <div
      className={`${outerPadding} ${className}`}
      id={anchorId}
      aria-label={ariaLabel || title}
    >
      {image && title ? (
        <div className="relative w-full h-64 sm:h-80 mb-6 sm:mb-8 rounded-t-lg overflow-hidden">
          <a href={`#${anchorId}`} className="group block w-full h-full">
            <img
              src={image.src}
              alt={image.alt || title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-6">
              <h2
                className={`title text-xl sm:text-2xl lg:text-3xl cursor-pointer transition-colors duration-200 relative ${textClass}`}
              >
                <svg
                  className="absolute -right-6 top-[55%] transform -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                {title}
              </h2>
              {subtitle && (
                <p className="text-base sm:text-lg text-white/90 mt-2">
                  {subtitle}
                </p>
              )}
            </div>
          </a>
        </div>
      ) : title ? (
        <div className="text-center mb-6 sm:mb-8">
          <a href={`#${anchorId}`} className="group inline-block">
            <h2
              className={`title mb-4 text-lg sm:text-xl cursor-pointer transition-colors duration-200 relative ${textClass}`}
            >
              <svg
                className="absolute -left-6 top-[55%] transform -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              {title}
            </h2>
          </a>
          {subtitle && (
            <p className={`text-base sm:text-lg ${textClassSubtitle}`}>
              {subtitle}
            </p>
          )}
        </div>
      ) : null}

      {html ? (
        <div
          className={innerPadding}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className={innerPadding}>{children}</div>
      )}
    </div>
  );
};

export default Section;
