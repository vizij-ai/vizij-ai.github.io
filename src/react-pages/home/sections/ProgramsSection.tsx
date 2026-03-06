import React from "react";
import { clsx } from "clsx";
import SectionBlock, {
  type SectionVariant,
} from "@/components/sections/SectionBlock";
import { LinkCard } from "@semio-community/ecosystem-site-core";
import {
  CpuBolt,
  CodeSquare,
  TestTube,
} from "@solar-icons/react-perf/LineDuotone";

export interface ProgramsSectionItem {
  title: string;
  description?: string;
  /**
   * Optional icon to render at the top of the tile.
   * Pass a React node already styled, or raw and rely on wrapper spacing.
   */
  icon?: React.ReactNode;
  /**
   * Extra inline links rendered under the description.
   */
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
    rel?: string;
    target?: string;
  }>;
}

export interface ProgramsSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
  className?: string;
  /**
   * Tailwind classes to customize the grid wrapper.
   */
  gridClassName?: string;
  /**
   * Heading color variant (matches site section styles).
   */
  variant?: SectionVariant;
  /**
   * Program tiles to render in the grid.
   */
  items: ProgramsSectionItem[];
  /**
   * Optional content rendered below the grid (e.g., CTA paragraph).
   */
  children?: React.ReactNode;
}

export default function ProgramsSection({
  id = "programs",
  title = "Our Programs",
  subtitle = "Discover our projects and services for robotics hardware, software, and research",
  ariaLabel,
  className,
  gridClassName,
  variant = "secondary",
  items,
  children,
}: ProgramsSectionProps) {
  return (
    <SectionBlock
      id={id}
      title={title}
      subtitle={subtitle}
      ariaLabel={ariaLabel || title}
      variant={variant}
      className={className}
    >
      <div
        className={clsx(
          "max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 overflow-x-hidden mb-8",
          gridClassName,
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, idx) => (
            <LinkCard
              key={`${item.title}-${idx}`}
              title={item.title}
              description={item.description}
              variant={variant}
              iconRender={(className) => {
                const icons = [CpuBolt, CodeSquare, TestTube];
                const Icon = icons[idx] ?? CpuBolt;
                return <Icon className={className} />;
              }}
              extraLinks={(item.links ?? []).map((l) => ({
                label: l.label,
                href: l.href,
              }))}
            />
          ))}
        </div>
      </div>

      {children ? (
        <div className="prose prose-citrus max-w-none text-center">
          {children}
        </div>
      ) : null}
    </SectionBlock>
  );
}
