import React from "react";
import type { CollectionEntry } from "astro:content";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import { DetailHero } from "@/components/detail/DetailHero";
import ContentSection from "@/components/detail/ContentSection";
import LinkSection from "@/components/detail/LinkSection";
import InfoCard from "@/components/detail/InfoCard";
import { ResearchCard } from "@/components/cards/ResearchCard";
import { HardwareCard } from "@/components/cards/HardwareCard";
import { SoftwareCard } from "@/components/cards/SoftwareCard";
import { EventCard } from "@/components/cards/EventCard";
import { OrganizationCard } from "@/components/cards/OrganizationCard";
import {
  PersonListElement,
  type PersonListElementProps,
} from "@/components/cards/PersonListElement";
import BasicChip from "@/components/ui/BasicChip";
import { resolveDetailImagePolicy, resolveLogoAsset } from "@/utils/images";

type OrganizationData = CollectionEntry<"organizations">["data"];

export type KeyContact = {
  personId: string;
  person: PersonListElementProps["data"];
  role?: string;
  department?: string;
  currentAffiliation?: {
    organizationId: string;
    partnerName?: string;
    role: string;
  };
};

export interface OrganizationDetailProps {
  data: OrganizationData;
  relatedContent?: {
    research?: CollectionEntry<"research">[];
    hardware?: CollectionEntry<"hardware">[];
    software?: CollectionEntry<"software">[];
    events?: CollectionEntry<"events">[];
  };
  relatedOrganizations?: CollectionEntry<"organizations">[];
  keyContacts?: KeyContact[];
}

const typeLabels: Record<string, string> = {
  academic: "Academic Institution",
  industry: "Industry Partner",
  nonprofit: "Non-Profit Organization",
  government: "Government Agency",
  community: "Community Organization",
};

const categoryLabels: Record<string, string> = {
  research: "Research Collaboration",
  development: "Development Partner",
  funding: "Funding Partner",
  infrastructure: "Infrastructure Support",
  outreach: "Outreach & Education",
};

export function OrganizationDetail({
  data,
  relatedContent,
  relatedOrganizations = [],
  keyContacts = [],
}: OrganizationDetailProps) {
  const detailImages = resolveDetailImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });
  const badges = [
    {
      text: typeLabels[data.type] || data.type,
      color: "blue" as const,
      variant: "outline" as const,
    },
  ];

  const contactItems: Array<{ label: string; value: string; link?: string }> =
    [];
  if (data.links?.email) {
    contactItems.push({
      label: "Email",
      value: data.links.email,
      link: `mailto:${data.links.email}`,
    });
  }
  if (data.links?.phone) {
    contactItems.push({
      label: "Phone",
      value: data.links.phone,
      link: `tel:${data.links.phone}`,
    });
  }
  if (data.links?.scheduling) {
    contactItems.push({
      label: "Scheduling",
      value: data.links.scheduling,
      link: data.links.scheduling,
    });
  }

  const hasRelated =
    (relatedContent?.research?.length || 0) > 0 ||
    (relatedContent?.hardware?.length || 0) > 0 ||
    (relatedContent?.software?.length || 0) > 0 ||
    (relatedContent?.events?.length || 0) > 0 ||
    relatedOrganizations.length > 0;
  const hasPartnerContributions =
    (relatedContent?.research?.length || 0) > 0 ||
    (relatedContent?.hardware?.length || 0) > 0 ||
    (relatedContent?.software?.length || 0) > 0 ||
    (relatedContent?.events?.length || 0) > 0;

  return (
    <BaseDetailLayout
      hero={
        <DetailHero
          image={detailImages.image}
          title={data.shortName ? data.shortName : data.name}
          subtitle={
            data.shortName && data.shortName !== data.name
              ? data.name
              : undefined
          }
          badges={badges}
          featuredState={data.featured ? "featured" : "not-featured"}
          logo={detailImages.profile}
          entityType="organization"
          showFallbackAvatar={detailImages.showFallbackIcon}
          logoBackdrop={detailImages.logoBackdrop}
        />
      }
      links={
        <div className="space-y-4">
          {data.links && Object.keys(data.links).length > 0 && (
            <LinkSection links={data.links} size="md" className="gap-1" />
          )}
          {contactItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {contactItems.map((item) => (
                <div className="flex items-center gap-2" key={item.label}>
                  <span className="text-color-600 dark:text-color-400">
                    {item.label}:
                  </span>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-accent-one hover:text-accent-two transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-accent-base">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      }
      metadata={
        <div className="partnership-details mb-8">
          <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
            <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
              PARTNERSHIP DETAILS
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <BasicChip
                text={categoryLabels[data.category] || data.category}
                variant="primary"
              />
              <BasicChip
                text={typeLabels[data.type] || data.type}
                variant="default"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-color-600 dark:text-color-400 font-semibold block mb-1">
                  Location
                </span>
                <span className="text-accent-base">
                  {data.location.city}, {data.location.country}
                </span>
              </div>
              <div>
                <span className="text-xs text-color-600 dark:text-color-400 font-semibold block mb-1">
                  Partner Type
                </span>
                <span className="text-accent-base">
                  {typeLabels[data.type] || data.type}
                </span>
              </div>
              <div>
                <span className="text-xs text-color-600 dark:text-color-400 font-semibold block mb-1">
                  Category
                </span>
                <span className="text-accent-base">
                  {categoryLabels[data.category] || data.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      contributors={
        keyContacts.length > 0 ? (
          <InfoCard title="KEY PEOPLE">
            <div className="space-y-2">
              {keyContacts.map((contact) => {
                const personData =
                  contact.person || ({ name: contact.personId } as any);
                return (
                  <PersonListElement
                    key={contact.personId}
                    personId={contact.personId}
                    data={personData}
                    affiliationLabel={
                      contact.role
                        ? contact.department
                          ? `${contact.role}, ${contact.department}`
                          : contact.role
                        : contact.department ||
                          contact.currentAffiliation?.partnerName
                    }
                    className="w-full"
                  />
                );
              })}
            </div>
          </InfoCard>
        ) : null
      }
      tags={
        data.collaborationSummary ? (
          <div className="collaboration-summary mb-8">
            <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
              <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
                COLLABORATION SUMMARY
              </h3>
              <p className="text-sm text-accent-base leading-relaxed">
                {data.collaborationSummary}
              </p>
            </div>
          </div>
        ) : null
      }
      description={<ContentSection title="ABOUT" content={data.description} />}
      related={
        hasRelated ? (
          <div className="space-y-12">
            {hasPartnerContributions && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Partner Contributions
                </h2>
                <p className="text-color-600 dark:text-color-400 mb-8">
                  Research, projects, and events involving{" "}
                  {data.shortName || data.name}
                </p>
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
              </div>
            )}

            {relatedOrganizations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Related Organizations
                </h2>
                <p className="text-color-600 dark:text-color-400 mb-8">
                  Organizations with similar focus areas
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedOrganizations.map((partner) => (
                    <OrganizationCard
                      key={partner.id}
                      organizationId={partner.id}
                      data={partner.data}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null
      }
    />
  );
}
