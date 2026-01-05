import React from "react";
import type { CollectionEntry } from "astro:content";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import { DetailHero } from "@/components/detail/DetailHero";
import ContentSection from "@/components/detail/ContentSection";
import InfoCard from "@/components/detail/InfoCard";
import LinkSection from "@/components/detail/LinkSection";
import { RelatedItemsGrid } from "@/components/detail/RelatedItemsGrid";
import {
  PersonListElement,
  type PersonListElementProps,
} from "@/components/cards/PersonListElement";
import { OrganizationListElement } from "@/components/cards/OrganizationListElement";
import { HardwareCard } from "@/components/cards/HardwareCard";
import { SoftwareCard } from "@/components/cards/SoftwareCard";
import { resolveDetailImagePolicy, resolveLogoAsset } from "@/utils/images";

type ResearchData = CollectionEntry<"research">["data"];

export type ResearchAuthor = {
  personId: string;
  person: PersonListElementProps["data"] | null;
  order: number;
  affiliationSnapshot?: string;
  corresponding?: boolean;
  equalContribution?: boolean;
};

export type OrganizationRole =
  | "lead"
  | "affiliated"
  | "funding"
  | "collaborator";

export type ResearchOrganizationLink = {
  role: OrganizationRole;
  note?: string;
  organization: CollectionEntry<"organizations">;
};

export interface ResearchDetailProps {
  data: ResearchData;
  authors?: ResearchAuthor[];
  authorsSubtitle?: string;
  organizationLinks?: ResearchOrganizationLink[];
  relatedHardware?: CollectionEntry<"hardware">[];
  relatedSoftware?: CollectionEntry<"software">[];
  relatedResearch?: CollectionEntry<"research">[];
}

const TYPE_LABELS: Record<string, string> = {
  study: "Study",
  paper: "Research Paper",
  thesis: "Thesis",
  report: "Technical Report",
  preprint: "Preprint",
  dataset: "Dataset",
  benchmark: "Benchmark",
};

const ORGANIZATION_ROLE_LABELS: Record<OrganizationRole, string> = {
  lead: "Lead Organization",
  affiliated: "Affiliated Organization",
  funding: "Funding Organization",
  collaborator: "Collaborating Organization",
};

function getPublishYearFromData(entryData: ResearchData & { year?: number }) {
  const date = entryData.publishDate
    ? new Date(entryData.publishDate)
    : undefined;
  if (date && !Number.isNaN(date.getTime())) {
    return date.getFullYear();
  }
  if (typeof entryData.year === "number") {
    return entryData.year;
  }
  return undefined;
}

export function ResearchDetail({
  data,
  authors = [],
  authorsSubtitle,
  organizationLinks = [],
  relatedHardware = [],
  relatedSoftware = [],
  relatedResearch = [],
}: ResearchDetailProps) {
  const detailImages = resolveDetailImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });
  const publishDate = data.publishDate ? new Date(data.publishDate) : undefined;
  const displayYear = getPublishYearFromData(
    data as ResearchData & { year?: number },
  );
  const legacyVenue = (data as { venue?: string }).venue;
  const legacyCitations = (data as { citations?: number }).citations;

  const badges: Array<{
    text: string;
    color: "blue" | "gray" | "accent";
    variant: "solid" | "outline";
  }> = [];

  badges.push({
    text: TYPE_LABELS[data.type] || data.type,
    color: "blue",
    variant: "solid",
  });

  if (displayYear) {
    badges.push({
      text: displayYear.toString(),
      color: "gray",
      variant: "outline",
    });
  }

  if (data.featured) {
    badges.push({
      text: "Featured",
      color: "accent",
      variant: "solid",
    });
  }

  const sortedAuthors = [...authors].sort((a, b) => a.order - b.order);
  const validAuthors = sortedAuthors.filter((author) => author.person);

  const publicationItems: Array<{ label: string; value: string }> = [];

  if (legacyVenue) {
    publicationItems.push({
      label: "Venue",
      value: legacyVenue,
    });
  }

  if (displayYear) {
    publicationItems.push({
      label: "Year",
      value: displayYear.toString(),
    });
  }

  if (publishDate) {
    publicationItems.push({
      label: "Published",
      value: publishDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
  } else {
    publicationItems.push({
      label: "Status",
      value: "Ongoing",
    });
  }

  if (legacyCitations && legacyCitations > 0) {
    publicationItems.push({
      label: "Citations",
      value: legacyCitations.toString(),
    });
  }

  const organizationsByRole: Record<
    OrganizationRole,
    Array<{ organization: CollectionEntry<"organizations">; note?: string }>
  > = {
    lead: [],
    affiliated: [],
    funding: [],
    collaborator: [],
  };

  organizationLinks.forEach((link) => {
    if (!ORGANIZATION_ROLE_LABELS[link.role]) return;
    organizationsByRole[link.role].push({
      organization: link.organization,
      note: link.note,
    });
  });

  const organizationRoleEntries = Object.entries(organizationsByRole).filter(
    ([, list]) => list.length > 0,
  ) as Array<
    [
      OrganizationRole,
      Array<{ organization: CollectionEntry<"organizations">; note?: string }>,
    ]
  >;

  const relatedResearchItems = relatedResearch.map((relatedEntry) => {
    const yearLabel = getPublishYearFromData(
      relatedEntry.data as ResearchData & { year?: number },
    );
    const typeLabel =
      TYPE_LABELS[relatedEntry.data.type] || relatedEntry.data.type;
    return {
      id: relatedEntry.id,
      data: {
        ...relatedEntry.data,
        name: relatedEntry.data.title,
        title: relatedEntry.data.title,
        description: relatedEntry.data.description,
        shortDescription: [typeLabel, yearLabel]
          .filter(Boolean)
          .join(" \u2022 "),
        imagePolicy: relatedEntry.data.imagePolicy,
      },
    };
  });

  return (
    <BaseDetailLayout
      hero={
        <DetailHero
          image={detailImages.image}
          title={data.title}
          subtitle={authorsSubtitle}
          badges={badges}
          featuredState={data.featured ? "featured" : undefined}
          thumbnail={detailImages.profile}
          entityType="research"
          showFallbackAvatar={detailImages.showFallbackIcon}
          logoBackdrop={detailImages.logoBackdrop}
        />
      }
      links={
        data.links && Object.keys(data.links).length > 0 ? (
          <LinkSection links={data.links} size="md" className="gap-1" />
        ) : null
      }
      description={
        <ContentSection title="SUMMARY" content={data.description} />
      }
      contributors={
        <>
          {validAuthors.length > 0 && (
            <InfoCard title="CONTRIBUTORS">
              <div className="space-y-2">
                {validAuthors.map((author) => (
                  <div
                    key={`${author.personId}-${author.order}`}
                    className="flex items-center gap-2"
                  >
                    <PersonListElement
                      personId={author.personId}
                      data={author.person as any}
                      affiliationLabel={author.affiliationSnapshot}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1 shrink-0 text-xs">
                      {author.corresponding && (
                        <span
                          className="text-accent-one"
                          title="Corresponding Author"
                        >
                          ✉
                        </span>
                      )}
                      {author.equalContribution && (
                        <span
                          className="text-color-500"
                          title="Equal Contribution"
                        >
                          *
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {organizationRoleEntries.length > 0 && (
            <InfoCard title="ORGANIZATIONS">
              {organizationRoleEntries.map(([role, organizations]) => (
                <div key={role} className="mb-4 last:mb-0 space-y-2">
                  <h4 className="text-xs font-medium mb-2 text-color-600 dark:text-color-400">
                    {ORGANIZATION_ROLE_LABELS[role]}
                  </h4>
                  <div className="space-y-2">
                    {organizations.map(({ organization, note }) => (
                      <div
                        key={organization.id}
                        className="flex items-start gap-2"
                      >
                        <OrganizationListElement
                          organizationId={organization.id}
                          data={organization.data}
                          roleLabel={
                            note
                              ? `${ORGANIZATION_ROLE_LABELS[role]} • ${note}`
                              : ORGANIZATION_ROLE_LABELS[role]
                          }
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </InfoCard>
          )}
        </>
      }
      metadata={
        publicationItems.length > 0 ? (
          <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
            <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
              DETAILS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {publicationItems.map((item) => (
                <div key={item.label}>
                  <span className="text-xs text-color-600 dark:text-color-400 font-semibold block mb-1">
                    {item.label}
                  </span>
                  <span className="text-accent-base">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
      tags={
        data.topics && data.topics.length > 0 ? (
          <InfoCard title="RESEARCH TOPICS">
            <div className="flex flex-wrap gap-2">
              {data.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 bg-accent-one/10 rounded-lg text-sm text-accent-base"
                >
                  {topic}
                </span>
              ))}
            </div>
          </InfoCard>
        ) : null
      }
      related={
        <>
          {relatedHardware.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Related Hardware</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedHardware.map((hw) => (
                  <HardwareCard key={hw.id} hardwareId={hw.id} data={hw.data} />
                ))}
              </div>
            </div>
          )}

          {relatedSoftware.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Related Software</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedSoftware.map((sw) => (
                  <SoftwareCard key={sw.id} softwareId={sw.id} data={sw.data} />
                ))}
              </div>
            </div>
          )}

          {relatedResearchItems.length > 0 && (
            <RelatedItemsGrid
              title="Related Research"
              subtitle="Related papers, datasets, and benchmarks"
              items={relatedResearchItems}
              itemType="research"
              columns={3}
            />
          )}
        </>
      }
    />
  );
}
