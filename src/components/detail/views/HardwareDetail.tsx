import React from "react";
import type { CollectionEntry } from "astro:content";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import { DetailHero } from "@/components/detail/DetailHero";
import ContentSection from "@/components/detail/ContentSection";
import LinkSection from "@/components/detail/LinkSection";
import InfoCard from "@/components/detail/InfoCard";
import SpecificationsList from "@/components/detail/SpecificationsList";
import FeaturesList from "@/components/detail/FeaturesList";
import ChipsList from "@/components/detail/ChipsList";
import { RelatedItemsGrid } from "@/components/detail/RelatedItemsGrid";
import { OrganizationListElement } from "@/components/cards/OrganizationListElement";
import {
  PersonListElement,
  type PersonListElementProps,
} from "@/components/cards/PersonListElement";
import {
  getCategoryLabel,
  getStatusColor,
  getStatusLabel,
} from "@/config/statusConfig";
import { resolveLogoAsset } from "@/utils/images";

type HardwareData = CollectionEntry<"hardware">["data"];

export type HardwareOrganizationContributor = {
  organizationId: string;
  role?: string;
  primary?: boolean;
  data?: CollectionEntry<"organizations">["data"];
};

export type HardwarePersonContributor = {
  personId: string;
  person?: PersonListElementProps["data"] | null;
  role?: string;
  currentAffiliation?: {
    organizationId: string;
    partnerName?: string;
    role: string;
  };
};

export interface HardwareDetailProps {
  data: HardwareData;
  organizationContributors?: HardwareOrganizationContributor[];
  peopleContributors?: HardwarePersonContributor[];
  relatedHardware?: CollectionEntry<"hardware">[];
}

export function HardwareDetail({
  data,
  organizationContributors = [],
  peopleContributors = [],
  relatedHardware = [],
}: HardwareDetailProps) {
  const badges =
    data.status && data.status.length > 0
      ? [
          {
            text: getStatusLabel(data.status),
            color: getStatusColor(data.status, "chip") as any,
            variant: "solid" as const,
          },
        ]
      : [];

  const hasContributors =
    organizationContributors.length > 0 || peopleContributors.length > 0;
  const categoryLabel = getCategoryLabel("hardware", data.category);
  const topics = data.topics ?? [];

  const primaryOrganization = organizationContributors.find(
    (contributor) => contributor.primary,
  );
  const supportingOrganizations = organizationContributors.filter(
    (contributor) => !contributor.primary,
  );

  const hasRelated = relatedHardware.length > 0;

  return (
    <BaseDetailLayout
      hero={
        <DetailHero
          image={data.images?.hero}
          title={data.name}
          subtitle={data.shortDescription}
          badges={badges}
          featuredState={data.featured ? "featured" : undefined}
          entityType="hardware"
          logo={resolveLogoAsset(data.images)}
        />
      }
      links={
        data.links && Object.keys(data.links).length > 0 ? (
          <LinkSection links={data.links} size="md" className="gap-1" />
        ) : null
      }
      description={
        <ContentSection title="DESCRIPTION" content={data.description} />
      }
      contributors={
        hasContributors ? (
          <div className="space-y-4">
            {organizationContributors.filter((c) => c.data).length > 0 && (
              <InfoCard title="ORGANIZATIONS">
                <div className="space-y-2">
                  {organizationContributors
                    .filter((contributor) => contributor.data)
                    .map((contributor) => (
                      <OrganizationListElement
                        key={contributor.organizationId}
                        organizationId={contributor.organizationId}
                        data={contributor.data}
                        roleLabel={
                          contributor.role ||
                          (contributor.primary
                            ? "Lead Organization"
                            : "Contributing Organization")
                        }
                        className="w-full"
                      />
                    ))}
                </div>
              </InfoCard>
            )}

            {peopleContributors.filter((c) => c.person).length > 0 && (
              <InfoCard title="CONTRIBUTORS">
                <div className="space-y-2">
                  {peopleContributors
                    .filter((contributor) => contributor.person)
                    .map((contributor) => (
                      <PersonListElement
                        key={contributor.personId}
                        personId={contributor.personId}
                        data={contributor.person as any}
                        affiliationLabel={
                          contributor.role ||
                          contributor.currentAffiliation?.partnerName
                        }
                        className="w-full"
                      />
                    ))}
                </div>
              </InfoCard>
            )}

            <div className="flex flex-wrap gap-6 text-xs text-color-600 dark:text-color-400">
              {primaryOrganization && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Lead:</span>
                  <span>
                    {primaryOrganization.data?.shortName ||
                      primaryOrganization.data?.name ||
                      primaryOrganization.organizationId}
                  </span>
                </div>
              )}
              {supportingOrganizations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Supporting:</span>
                  <span>
                    {supportingOrganizations.length} org
                    {supportingOrganizations.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {peopleContributors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Contributors:</span>
                  <span>
                    {peopleContributors.length}{" "}
                    {peopleContributors.length === 1 ? "person" : "people"}
                  </span>
                </div>
              )}
              {categoryLabel && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Category:</span>
                  <span>{categoryLabel}</span>
                </div>
              )}
            </div>
          </div>
        ) : null
      }
      specifications={
        <SpecificationsList
          title="SPECIFICATIONS"
          items={data.specifications || {}}
          defaultItemIcon="solar:settings-minimalistic-line-duotone"
        />
      }
      features={
        data.features && data.features.length > 0 ? (
          <FeaturesList title="KEY FEATURES" features={data.features} />
        ) : null
      }
      tags={
        topics.length > 0 ? (
          <ChipsList title="TOPICS" items={topics} variant="primary" />
        ) : null
      }
      related={
        hasRelated ? (
          <RelatedItemsGrid
            title="Related Hardware"
            subtitle="Explore similar robotic platforms"
            items={relatedHardware}
            itemType="hardware"
            columns={3}
          />
        ) : null
      }
    />
  );
}
