import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Avatar } from "@/components/ui/Avatar";
import "./PersonPopover.css";
import { User, UserBlockRounded } from "@solar-icons/react-perf/LineDuotone";
import type { LinkType } from "@/components/ui/IconButton";
import LinkSection from "@/components/detail/LinkSection";

export interface PersonPopoverProps {
  person: {
    id: string;
    name: string;
    honorific?: string;
    pronouns?: string;
    title?: string;
    bio?: string;
    expertise?: string[];
    affiliations?: Array<{
      organizationId: string;
      role: string;
      department?: string;
      startDate?: Date;
      endDate?: Date;
      isPrimary?: boolean;
    }>;
    links?: Partial<Record<LinkType, string>>;
    images?: {
      avatar?: {
        src: string;
        width: number;
        height: number;
        format: string;
      };
    };
  } | null;
  personId: string;
  role?: string;
  currentAffiliation?: {
    organizationId: string;
    partnerName?: string;
    role: string;
  };
}

export function PersonPopover({
  person,
  role,
  currentAffiliation,
}: PersonPopoverProps) {
  if (!person) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full">
        <UserBlockRounded className="w-5 h-5 text-neutral-400" />
        <span className="text-sm text-neutral-500">Unknown Person</span>
      </span>
    );
  }

  const displayName = person.honorific
    ? `${person.honorific} ${person.name}`
    : person.name;

  const handleNavigate = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    window.location.href = `/people/${person.id}`;
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 bg-surface-lighter rounded-full border-2 border-accent-one/40 hover:border-accent-one data-[state=open]:border-accent-two hover:data-[state=closed]:border-accent-one transition-all cursor-pointer focus:outline-none focus:border-accent-two">
          <Avatar
            src={person.images?.avatar}
            alt={displayName}
            name={person.name}
            type="person"
            size="xs"
          />
          <span className="text-sm font-medium">{displayName}</span>
          {role && (
            <span className="text-xs text-color-600 dark:text-color-400">
              • {role}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="popover-content w-80 p-4 bg-surface rounded-lg shadow-xl border border-accent-base/50 outline-hidden"
          sideOffset={5}
          align="start"
        >
          <a
            href={`/people/${person.id}`}
            className="flex items-start gap-4 no-underline hover:opacity-90 transition-opacity"
          >
            <div className="shrink-0 mt-3">
              <Avatar
                src={person.images?.avatar}
                alt={displayName}
                name={displayName}
                type="person"
                size="lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base text-color">
                {displayName}
                {person.pronouns && (
                  <span className="ml-2 text-xs font-normal text-accent-base">
                    ({person.pronouns})
                  </span>
                )}
              </h4>
              {person.title && (
                <p className="text-sm text-accent-base">{person.title}</p>
              )}
              {currentAffiliation && (
                <p className="text-xs text-accent-base mt-1">
                  {currentAffiliation.role} at{" "}
                  {currentAffiliation.partnerName ||
                    currentAffiliation.organizationId}
                </p>
              )}
            </div>
          </a>

          {person.bio && (
            <p className="mt-3 text-sm text-accent-base line-clamp-3">
              {person.bio}
            </p>
          )}

          {person.expertise && person.expertise.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-400">
                Expertise:
              </p>
              <div className="flex flex-wrap gap-1">
                {person.expertise.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 bg-accent-two/10 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {person.expertise.length > 5 && (
                  <span className="text-xs px-2 py-0.5 text-neutral-500">
                    +{person.expertise.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-3 text-xs justify-between">
            <button
              onClick={handleNavigate}
              className="text-accent-one hover:text-accent-two transition-colors flex items-center gap-1 font-medium focus:outline-none"
            >
              <User className="w-3 h-3" />
              View Profile
            </button>
            <LinkSection
              links={person.links}
              size="sm"
              max={5}
              as="button"
              external
              stopPropagation
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
