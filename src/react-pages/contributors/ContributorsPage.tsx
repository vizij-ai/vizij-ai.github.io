import React from "react";
import type { CollectionEntry } from "astro:content";
import Section from "@/components/sections/Section";
import HeroHeader from "@/components/hero/HeroHeader";
import { SubsectionGrid } from "@/components/sections/SubsectionGrid";
import {
  PersonListElement,
  PersonCard,
  OrganizationCard,
  BaseUrlProvider,
} from "@semio-community/ecosystem-site-core";
import {
  toPersonCardData,
  toOrganizationCardData,
} from "@/utils/card-mappers";
import { UsersGroupTwoRounded } from "@solar-icons/react-perf/LineDuotone";

interface PartnerSection {
  type: string;
  info: {
    title: string;
    icon: string;
    description: string;
  } | null;
  partners: CollectionEntry<"organizations">[];
}

export interface ContributorsPageProps {
  meta: {
    title: string;
    description: string;
  };
  hideBoardMembers: boolean;
  boardMembers: CollectionEntry<"people">[];
  communityMembers: CollectionEntry<"people">[];
  partnerSections: PartnerSection[];
  donorPeople: CollectionEntry<"people">[];
  donorOrganizations: CollectionEntry<"organizations">[];
  grantMakers: CollectionEntry<"organizations">[];
  donorsCount: number;
  sponsorsUniqueCount: number;
  orgNameById: Record<string, string>;
  baseUrl?: string;
}

export default function ContributorsPage({
  meta,
  hideBoardMembers,
  boardMembers,
  communityMembers,
  partnerSections,
  donorPeople,
  donorOrganizations,
  grantMakers,
  donorsCount,
  sponsorsUniqueCount,
  orgNameById,
  baseUrl,
}: ContributorsPageProps) {
  return (
    <BaseUrlProvider baseUrl={baseUrl ?? "/"}>
    <div className="space-y-16">
      <HeroHeader
        icon={<UsersGroupTwoRounded className="w-16 h-16 text-accent-two" />}
        title={meta.title}
        description={meta.description}
        actions={[
          {
            label: "People",
            href: "#people",
            indicatorText: (
              (hideBoardMembers ? 0 : boardMembers.length) +
                communityMembers.length || 0
            ).toString(),
          },
          {
            label: "Partners",
            href: "#partners",
            variant: "secondary",
            indicatorText: partnerSections
              .reduce((sum, section) => sum + section.partners.length, 0)
              .toString(),
          },
          {
            label: "Sponsors",
            href: "#sponsors",
            variant: "tertiary",
            indicatorText: sponsorsUniqueCount.toString(),
          },
        ]}
      />

      <Section
        id="people"
        title="People"
        subtitle="The individuals who lead and support our community"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          {!hideBoardMembers && (
            <SubsectionGrid
              id="board-members"
              title="Board Members"
              icon="solar:crown-line-duotone"
              count={boardMembers.length}
              gridClass="grid grid-cols-1 md:grid-cols-2 gap-4"
              empty={boardMembers.length === 0}
              emptyIcon="solar:users-group-rounded-line-duotone"
              emptyMessage="Board members will be announced soon."
            >
              {boardMembers.map((person) => (
                <PersonListElement
                  key={person.id}
                  personId={person.id}
                  data={toPersonCardData(person.data)}
                  affiliationLabel={affiliationLabelFor(person, orgNameById)}
                />
              ))}
            </SubsectionGrid>
          )}

          <SubsectionGrid
            id="community-members"
            title="Community Members"
            icon="solar:users-group-rounded-line-duotone"
            count={communityMembers.length}
            gridClass="grid grid-cols-1 md:grid-cols-2 gap-4"
            empty={communityMembers.length === 0}
            emptyIcon="solar:users-group-rounded-line-duotone"
            emptyMessage="Community contributors coming soon."
          >
            {communityMembers.map((person) => (
              <PersonListElement
                key={person.id}
                personId={person.id}
                data={toPersonCardData(person.data)}
                affiliationLabel={affiliationLabelFor(person, orgNameById)}
              />
            ))}
          </SubsectionGrid>
        </div>
      </Section>

      <Section
        id="partners"
        title="Partners"
        subtitle="Organizations committed to advancing HRI together"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          {partnerSections.map(({ type, info, partners }) => (
            <SubsectionGrid
              key={type}
              id={`partners-${type}`}
              title={info?.title || type}
              subtitle={info?.description}
              icon={info?.icon || "solar:folder-line-duotone"}
              count={partners.length}
              empty={partners.length === 0}
              emptyIcon="solar:buildings-2-line-duotone"
              emptyMessage="Partner information coming soon."
            >
              {partners.map((partner) => (
                <OrganizationCard
                  key={partner.id}
                  organizationId={partner.id}
                  data={toOrganizationCardData(partner.data)}
                  className="h-full"
                />
              ))}
            </SubsectionGrid>
          ))}
        </div>
      </Section>

      <Section
        id="sponsors"
        title="Sponsors"
        subtitle="Financial supporters that power our mission"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <SubsectionGrid
            id="sponsors-donors"
            title="Donors"
            icon="solar:wallet-money-line-duotone"
            count={donorsCount}
            empty={donorsCount === 0}
            emptyIcon="solar:wallet-money-line-duotone"
            emptyMessage="Donor acknowledgments coming soon."
          >
            {donorPeople.map((person) => (
              <PersonCard
                key={person.id}
                personId={person.id}
                data={toPersonCardData(person.data)}
                className="h-full"
              />
            ))}
            {donorOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organizationId={org.id}
                data={toOrganizationCardData(org.data)}
                className="h-full"
              />
            ))}
          </SubsectionGrid>

          <SubsectionGrid
            id="sponsors-grants"
            title="Grant-making Agencies"
            icon="solar:hand-money-line-duotone"
            count={grantMakers.length}
            empty={grantMakers.length === 0}
            emptyIcon="solar:hand-money-line-duotone"
            emptyMessage="Grant-making agencies coming soon."
          >
            {grantMakers.map((org) => (
              <OrganizationCard
                key={org.id}
                organizationId={org.id}
                data={toOrganizationCardData(org.data)}
                className="h-full"
              />
            ))}
          </SubsectionGrid>
        </div>
      </Section>
    </div>
    </BaseUrlProvider>
  );
}

function affiliationLabelFor(
  person: CollectionEntry<"people">,
  orgNameById: Record<string, string>,
) {
  const aff =
    person.data.affiliations?.find((a) => a.isPrimary) ??
    person.data.affiliations?.find((a) => !a.endDate);
  return aff
    ? orgNameById[aff.organizationId] || aff.organizationId
    : undefined;
}
