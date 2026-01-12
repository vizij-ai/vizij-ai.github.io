import type React from "react";
import CMS from "decap-cms-app";
import type { DetailHeroBadge } from "@/components/detail/DetailHero";
import {
  PersonDetail,
  type AffiliationDisplay,
} from "@/components/detail/views/PersonDetail";
import { EventDetail } from "@/components/detail/views/EventDetail";
import { OrganizationDetail } from "@/components/detail/views/OrganizationDetail";
import { HardwareDetail } from "@/components/detail/views/HardwareDetail";
import { SoftwareDetail } from "@/components/detail/views/SoftwareDetail";
import {
  ResearchDetail,
  type ResearchAuthor,
  type ResearchOrganizationLink,
} from "@/components/detail/views/ResearchDetail";
import Footer from "@/components/layout/Footer";
import previewStyles from "@/styles/global.css?inline";
declare const __CMS_ROOT__: string;

// Apply the same page-level chrome used by slug pages so component styles render as expected.
function applyPreviewChrome() {
  const root = document.documentElement;
  root.setAttribute("data-theme", "light");
  root.classList.add(
    "overflow-x-hidden",
    "grid",
    "scroll-pt-[72px]",
    "scroll-smooth",
    "font-sans",
    "text-text",
    "text-xl",
    "md:text-base",
    "antialiased",
    "bg-surface",
  );
  document.body.classList.add(
    "relative",
    "min-h-screen",
    "w-full",
    "bg-surface",
  );
}

if (typeof document !== "undefined") {
  applyPreviewChrome();
}

const DetailPreviewShell: React.FC<{
  children: React.ReactNode;
  mainClassName?: string;
}> = ({ children, mainClassName }) => (
  <div className="relative flex min-h-screen w-full flex-col bg-surface text-text font-sans antialiased">
    <div className="relative m-auto flex min-h-screen w-full flex-1 max-w-6xl">
      <div className="relative m-auto w-full max-w-5xl grow">
        <div className="m-auto grid min-h-screen grid-rows-[1fr_auto] px-4 md:px-8">
          <main className={`relative grow ${mainClassName ?? ""}`}>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  </div>
);

const LoadingPreview = () => (
  <DetailPreviewShell>
    <div className="p-6 text-sm text-color-700">Loading preview…</div>
  </DetailPreviewShell>
);

type PreviewEntry = {
  get: (key: string) => unknown;
  getIn: (path: Array<string | number>) => unknown;
};

type PreviewAsset =
  | {
      toString: () => string;
    }
  | string;

type PreviewProps = {
  entry: PreviewEntry;
  widgetFor: (field: string) => React.ReactNode;
  getAsset: (path: string) => PreviewAsset | undefined;
};

type PreviewData = Record<string, any>;

function safeData(entry: PreviewEntry | undefined): PreviewData {
  if (entry?.getIn) {
    const val = entry.getIn(["data"]);
    const maybeVal = val as { toJS?: () => unknown } | undefined;
    if (maybeVal?.toJS) return maybeVal.toJS() as PreviewData;
    return (val as PreviewData) ?? {};
  }
  return {};
}

function toAssetUrl(getAsset: PreviewProps["getAsset"], value?: string) {
  if (!value) return undefined;
  const rewriteLegacyPath = (p: string) => {
    if (p.startsWith("@/")) return p.replace(/^@\//, "/src/");
    if (p.startsWith("/assets/"))
      return p.replace(/^\/assets\//, "/src/assets/");
    return p;
  };

  // Rewrite Vite-style alias to a path the preview iframe can serve.
  const normalized = rewriteLegacyPath(
    value.startsWith("@/") ? value.replace(/^@\//, "/src/") : value,
  );

  const assetUrl = (() => {
    try {
      const asset = getAsset(normalized);
      if (!asset) return undefined;
      if (typeof asset === "string") return asset;
      if (typeof asset.toString === "function") return asset.toString();
      return undefined;
    } catch {
      return undefined;
    }
  })();
  if (assetUrl) {
    return assetUrl;
  }

  // For source assets, serve /@fs in dev and the copied /admin/src/assets/ in build.
  if (normalized.startsWith("/src/") && typeof __CMS_ROOT__ === "string") {
    if (import.meta.env.DEV) {
      return `/@fs${__CMS_ROOT__}${normalized}`;
    }
    if (normalized.startsWith("/src/assets/")) {
      return `/admin${normalized}`;
    }
  }

  return normalized;
}

const PeoplePreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const images = {
    avatar: toAssetUrl(getAsset, data?.images?.avatar || data?.avatar),
    hero: toAssetUrl(getAsset, data?.images?.hero || data?.hero),
  };
  const name = data?.honorific ? `${data.honorific} ${data.name}` : data?.name;
  const links = data?.links || {};
  const affiliations = (data?.affiliations || []) as Array<{
    organizationId?: string;
    role?: string;
    department?: string;
    endDate?: string | null;
  }>;

  const badges: DetailHeroBadge[] = [];
  if (data?.pronouns) {
    badges.push({
      text: data.pronouns,
      color: "gray" as const,
      variant: "outline" as const,
    });
  }
  if (data?.featured) {
    badges.push({ text: "Featured", color: "accent" as const });
  }

  const expertise = data?.expertise || [];
  const bio = data?.bio;
  const currentAffiliations: AffiliationDisplay[] = affiliations
    .filter((aff) => !aff?.endDate)
    .map((aff) => ({
      organizationId: aff.organizationId || "Organization",
      organizationName: aff.organizationId,
      organizationImages: undefined,
      role: aff.role,
      department: aff.department,
    }));
  const pastAffiliations: AffiliationDisplay[] = affiliations
    .filter((aff) => aff?.endDate)
    .map((aff) => ({
      organizationId: aff.organizationId || "Organization",
      organizationName: aff.organizationId,
      organizationImages: undefined,
      role: aff.role,
      department: aff.department,
    }));

  return (
    <DetailPreviewShell>
      <PersonDetail
        data={
          {
            ...data,
            images: {
              ...data.images,
              avatar: images.avatar,
              hero: images.hero,
            },
          } as any
        }
        fullName={name || "Person"}
        badges={badges}
        links={links}
        bio={bio}
        expertise={expertise}
        currentAffiliations={currentAffiliations}
        pastAffiliations={pastAffiliations}
        relatedContent={undefined}
        relatedPeople={[]}
      />
    </DetailPreviewShell>
  );
};

const EventPreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery =
    data?.images?.gallery?.map((img: string) => toAssetUrl(getAsset, img)) ||
    undefined;

  const normalizedData = {
    ...data,
    images: {
      ...data?.images,
      logo,
      hero,
      gallery,
    },
  };

  return (
    <DetailPreviewShell>
      <EventDetail data={normalizedData as any} relatedEvents={[]} />
    </DetailPreviewShell>
  );
};

const OrganizationPreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const logoUrl = toAssetUrl(getAsset, data?.images?.logoUrl);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery =
    data?.images?.gallery?.map((img: string) => toAssetUrl(getAsset, img)) ||
    undefined;

  const normalizedData = {
    ...data,
    images: { ...(data.images || {}), logo, logoUrl, hero, gallery },
  };

  return (
    <DetailPreviewShell>
      <OrganizationDetail
        data={normalizedData as any}
        relatedContent={{
          research: [],
          hardware: [],
          software: [],
          events: [],
        }}
        relatedOrganizations={[]}
        keyContacts={[]}
      />
    </DetailPreviewShell>
  );
};

const HardwarePreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  console.log("hardware data", data);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery = ((data?.images?.gallery || []) as string[])
    .map((img) => toAssetUrl(getAsset, img))
    .filter(Boolean) as string[];

  const normalizedData = {
    ...data,
    images: {
      ...data?.images,
      logo,
      hero,
      gallery,
    },
  };

  return (
    <DetailPreviewShell>
      <HardwareDetail
        data={normalizedData as any}
        organizationContributors={[]}
        peopleContributors={[]}
        relatedHardware={[]}
      />
    </DetailPreviewShell>
  );
};

const SoftwarePreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const logo = toAssetUrl(getAsset, data?.images?.logo);
  const hero = toAssetUrl(getAsset, data?.images?.hero);
  const gallery = ((data?.images?.gallery || []) as string[])
    .map((img) => toAssetUrl(getAsset, img))
    .filter(Boolean) as string[];

  const normalizedData = {
    ...data,
    images: {
      ...data?.images,
      logo,
      hero,
      gallery,
    },
  };

  return (
    <DetailPreviewShell>
      <SoftwareDetail
        data={normalizedData as any}
        organizationContributors={[]}
        peopleContributors={[]}
        relatedSoftware={[]}
      />
    </DetailPreviewShell>
  );
};

const ResearchPreview: React.FC<PreviewProps> = ({ entry, getAsset }) => {
  if (!entry || !entry.get) {
    return <LoadingPreview />;
  }
  const data = safeData(entry);
  const hero = toAssetUrl(getAsset, data?.images?.hero);

  const normalizedData = {
    ...data,
    images: {
      ...data?.images,
      hero,
    },
  };

  const authors: ResearchAuthor[] = (data?.contributors || []).map(
    (contributor: Record<string, unknown>, idx: number) => ({
      order: contributor?.order ?? idx,
      personId: contributor?.personId || `contributor-${idx + 1}`,
      person: {
        id: contributor?.personId || `contributor-${idx + 1}`,
        name: contributor?.personId || `Contributor ${idx + 1}`,
        pronouns: contributor?.pronouns,
        title: contributor?.affiliationSnapshot,
        bio: "",
        expertise: [],
        affiliations: [],
        links: {},
        images: {},
      },
      affiliationSnapshot: contributor?.affiliationSnapshot,
      corresponding: contributor?.corresponding,
      equalContribution: contributor?.equalContribution,
    }),
  );

  const organizationLinks: ResearchOrganizationLink[] = (
    data?.organizations || []
  ).map((org: Record<string, unknown>) => ({
    role: org?.role || "lead",
    note: org?.note,
    organization: {
      id: org?.organizationId || "organization",
      data: {
        name: org?.organizationId || "Organization",
        shortName: org?.organizationId || "Organization",
        images: {},
      },
    } as unknown as ResearchOrganizationLink["organization"],
  }));

  const authorsSubtitle =
    authors.length > 0
      ? authors
          .sort((a, b) => a.order - b.order)
          .map((a) => a.person?.name || a.personId)
          .join(", ")
      : undefined;

  return (
    <DetailPreviewShell>
      <ResearchDetail
        data={normalizedData as any}
        authors={authors}
        authorsSubtitle={authorsSubtitle}
        organizationLinks={organizationLinks}
        relatedHardware={[]}
        relatedSoftware={[]}
        relatedResearch={[]}
      />
    </DetailPreviewShell>
  );
};

// Inline the compiled site CSS so the preview iframe matches live spacing/borders.
CMS.registerPreviewStyle(previewStyles, { raw: true });
const safeTemplate =
  (Component: React.FC<PreviewProps>) => (props: PreviewProps) => {
    try {
      if (!props?.entry || !props.entry.get) {
        return <LoadingPreview />;
      }
      return <Component {...props} />;
    } catch (err) {
      console.error("Preview render error", err);
      return (
        <div style={{ padding: "1rem", color: "#b91c1c" }}>
          Preview error: {(err as Error)?.message ?? String(err)}
        </div>
      );
    }
  };

CMS.registerPreviewTemplate("people", safeTemplate(PeoplePreview));
CMS.registerPreviewTemplate("events", safeTemplate(EventPreview));
CMS.registerPreviewTemplate("organizations", safeTemplate(OrganizationPreview));
CMS.registerPreviewTemplate("hardware", safeTemplate(HardwarePreview));
CMS.registerPreviewTemplate("software", safeTemplate(SoftwarePreview));
CMS.registerPreviewTemplate("research", safeTemplate(ResearchPreview));

// Boot the CMS when bundled (needed when not using the CDN auto-init script).
CMS.init();
