import type { CollectionEntry } from "astro:content";
import * as sharedMappers from "@semio-community/ecosystem-site-core";
import type { KeyContact } from "@/components/detail/views/OrganizationDetail";
import type { ResearchAuthor } from "@/components/detail/views/ResearchDetail";
import type { PersonPopoverProps } from "@/components/people/PersonPopover";

type PersonEntry = CollectionEntry<"people"> | null | undefined;
type ResearchContributor = Omit<ResearchAuthor, "person">;

const mapperRegistry = sharedMappers as Record<string, unknown>;

const toPersonPopoverDataShared = mapperRegistry.toPersonPopoverData as
  | ((personEntry: PersonEntry) => PersonPopoverProps["person"])
  | undefined;

const toOrganizationKeyContactShared =
  mapperRegistry.toOrganizationKeyContact as
    | ((params: {
        personEntry: CollectionEntry<"people">;
        organizationId: string;
        partnerName?: string;
      }) => KeyContact)
    | undefined;

const toResearchAuthorShared = mapperRegistry.toResearchAuthor as
  | ((
      contributor: ResearchContributor,
      personEntry: CollectionEntry<"people"> | undefined,
    ) => ResearchAuthor)
  | undefined;

export function serializePersonForPopover(
  personEntry: PersonEntry,
): PersonPopoverProps["person"] {
  if (toPersonPopoverDataShared) {
    return toPersonPopoverDataShared(personEntry);
  }

  if (!personEntry?.data) {
    return null;
  }

  const { data } = personEntry;
  const avatar = data.images?.avatar;

  return {
    id: personEntry.id,
    name: data.name,
    honorific: data.honorific,
    pronouns: data.pronouns,
    title: data.title,
    bio: data.bio,
    expertise: data.expertise,
    links: data.links,
    images: avatar
      ? {
          avatar: {
            src: avatar.src,
            width: avatar.width,
            height: avatar.height,
            format: avatar.format,
          },
        }
      : undefined,
  };
}

export function serializeOrganizationKeyContact(params: {
  personEntry: CollectionEntry<"people">;
  organizationId: string;
  partnerName?: string;
}): KeyContact {
  if (toOrganizationKeyContactShared) {
    return toOrganizationKeyContactShared(params);
  }

  const { personEntry, organizationId, partnerName } = params;
  const affiliation = personEntry.data.affiliations?.find(
    (aff) => aff.organizationId === organizationId,
  );

  return {
    personId: personEntry.id,
    person: personEntry.data,
    role: affiliation?.role,
    department: affiliation?.department,
    currentAffiliation:
      affiliation && affiliation.role
        ? {
            organizationId,
            partnerName,
            role: affiliation.role,
          }
        : undefined,
  };
}

export function serializeResearchAuthor(
  contributor: ResearchContributor,
  personEntry: CollectionEntry<"people"> | undefined,
): ResearchAuthor {
  if (toResearchAuthorShared) {
    return toResearchAuthorShared(contributor, personEntry);
  }

  return {
    ...contributor,
    person: personEntry?.data ?? null,
  };
}
