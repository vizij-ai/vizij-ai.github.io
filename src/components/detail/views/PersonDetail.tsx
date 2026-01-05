import React from "react";
import type { CollectionEntry } from "astro:content";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import {
  DetailHero,
  type DetailHeroBadge,
} from "@/components/detail/DetailHero";
import ContentSection from "@/components/detail/ContentSection";
import InfoCard from "@/components/detail/InfoCard";
import LinkSection from "@/components/detail/LinkSection";
import { ResearchCard } from "@/components/cards/ResearchCard";
import { HardwareCard } from "@/components/cards/HardwareCard";
import { SoftwareCard } from "@/components/cards/SoftwareCard";
import { EventCard } from "@/components/cards/EventCard";
import { RelatedItemsGrid } from "@/components/detail/RelatedItemsGrid";
import { OrganizationListElement } from "@/components/cards/OrganizationListElement";
import { resolveDetailImagePolicy } from "@/utils/images";

type PersonData = CollectionEntry<"people">["data"];

export type AffiliationDisplay = {
  organizationId: string;
  organizationName?: string;
  organizationImages?: PersonData["images"];
  organizationData?: CollectionEntry<"organizations">["data"];
  role?: string;
  department?: string;
};

export interface PersonDetailProps {
  data: PersonData;
  fullName: string;
  badges?: DetailHeroBadge[];
  currentAffiliations?: AffiliationDisplay[];
  pastAffiliations?: AffiliationDisplay[];
  expertise?: string[];
  bio?: string | null;
  links?: PersonData["links"];
  relatedContent?: {
    research?: CollectionEntry<"research">[];
    hardware?: CollectionEntry<"hardware">[];
    software?: CollectionEntry<"software">[];
    events?: CollectionEntry<"events">[];
  };
  relatedPeople?: CollectionEntry<"people">[];
}

export function PersonDetail({
  data,
  fullName,
  badges = [],
  currentAffiliations = [],
  pastAffiliations = [],
  expertise = [],
  bio,
  links,
  relatedContent,
  relatedPeople = [],
}: PersonDetailProps) {
  const detailImages = resolveDetailImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: data.images?.avatar,
    policy: data.imagePolicy,
  });
  const hasRelated =
    (relatedContent?.research?.length || 0) > 0 ||
    (relatedContent?.hardware?.length || 0) > 0 ||
    (relatedContent?.software?.length || 0) > 0 ||
    (relatedContent?.events?.length || 0) > 0 ||
    relatedPeople.length > 0;

  return (
    <BaseDetailLayout
      hero={
        <DetailHero
          image={detailImages.image}
          title={fullName}
          subtitle={data.title}
          badges={badges}
          featuredState={data.featured ? "featured" : undefined}
          avatar={detailImages.profile}
          entityType="person"
          logoText={data.name}
          showFallbackAvatar={detailImages.showFallbackIcon}
          logoBackdrop={detailImages.logoBackdrop}
        />
      }
      links={
        links && Object.keys(links).length > 0 ? (
          <LinkSection links={links} size="md" className="gap-1" />
        ) : null
      }
      contributors={
        (currentAffiliations.length > 0 || pastAffiliations.length > 0) && (
          <InfoCard title="AFFILIATIONS">
            {currentAffiliations.length > 0 && (
              <div className="mb-4 space-y-2">
                <h4 className="text-xs font-medium text-color-600 dark:text-color-400">
                  Current
                </h4>
                <div className="space-y-2">
                  {currentAffiliations.map((aff, idx) => (
                    <OrganizationListElement
                      key={`${aff.organizationId}-current-${idx}`}
                      organizationId={aff.organizationId}
                      data={
                        aff.organizationData ??
                        (aff.organizationName || aff.organizationImages
                          ? ({
                              name: aff.organizationName || aff.organizationId,
                              shortName: aff.organizationName,
                              images: aff.organizationImages,
                            } as any)
                          : undefined)
                      }
                      roleLabel={
                        aff.department
                          ? `${aff.role || "Role"}, ${aff.department}`
                          : aff.role
                      }
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {pastAffiliations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-color-600 dark:text-color-400">
                  Past
                </h4>
                <div className="space-y-2">
                  {pastAffiliations.map((aff, idx) => (
                    <OrganizationListElement
                      key={`${aff.organizationId}-past-${idx}`}
                      organizationId={aff.organizationId}
                      data={
                        aff.organizationData ??
                        (aff.organizationName || aff.organizationImages
                          ? ({
                              name: aff.organizationName || aff.organizationId,
                              shortName: aff.organizationName,
                              images: aff.organizationImages,
                            } as any)
                          : undefined)
                      }
                      roleLabel={
                        aff.department
                          ? `${aff.role || "Role"}, ${aff.department}`
                          : aff.role
                      }
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </InfoCard>
        )
      }
      tags={
        expertise.length > 0 ? (
          <InfoCard title="EXPERTISE AREAS">
            <div className="flex flex-wrap gap-2">
              {expertise.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-accent-one/10 rounded-lg text-sm text-accent-base"
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoCard>
        ) : null
      }
      description={
        bio ? <ContentSection title="BIOGRAPHY" content={bio} /> : null
      }
      related={
        hasRelated ? (
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Contributions &amp; Involvement
              </h2>
              <p className="text-color-600 dark:text-color-400">
                Research, projects, and events
              </p>
            </div>

            {(relatedContent?.research?.length || 0) > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-4">Research</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedContent?.research?.map((item) => (
                    <ResearchCard
                      key={item.id}
                      researchId={item.id}
                      data={item.data}
                    />
                  ))}
                </div>
              </div>
            )}

            {(relatedContent?.hardware?.length || 0) > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-4">Hardware</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedContent?.hardware?.map((hw) => (
                    <HardwareCard
                      key={hw.id}
                      hardwareId={hw.id}
                      data={hw.data}
                    />
                  ))}
                </div>
              </div>
            )}

            {(relatedContent?.software?.length || 0) > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-4">Software</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedContent?.software?.map((sw) => (
                    <SoftwareCard
                      key={sw.id}
                      softwareId={sw.id}
                      data={sw.data}
                    />
                  ))}
                </div>
              </div>
            )}

            {(relatedContent?.events?.length || 0) > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-4">Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedContent?.events?.map((event) => (
                    <EventCard
                      key={event.id}
                      eventId={event.id}
                      data={event.data}
                    />
                  ))}
                </div>
              </div>
            )}

            {relatedPeople.length > 0 && (
              <div className="mt-12">
                <RelatedItemsGrid
                  title="Related Researchers"
                  subtitle="Researchers with similar expertise or affiliations"
                  items={relatedPeople.map((person) => ({
                    id: person.id,
                    data: {
                      ...person.data,
                      name: person.data.honorific
                        ? `${person.data.honorific} ${person.data.name}`
                        : person.data.name,
                      description: person.data.bio || person.data.title || "",
                      shortDescription: person.data.title || "",
                      images: person.data.images,
                      imagePolicy: person.data.imagePolicy,
                      featured: person.data.featured,
                    },
                  }))}
                  itemType="people"
                  columns={3}
                />
              </div>
            )}
          </div>
        ) : null
      }
    />
  );
}
