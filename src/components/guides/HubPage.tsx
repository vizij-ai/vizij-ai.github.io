import type {
  GuidebookHubCard as HubCard,
  GuidebookHubContent as HubPageContent,
} from "@/lib/guidebook-content";
import { resolveSitePath } from "@/utils/url";
import {
  ArrowRight,
  Book,
  CodeSquare,
  Rocket,
} from "@solar-icons/react-perf/LineDuotone";

const SERIF_STACK =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
const SANS_STACK =
  '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

const ICONS = [Book, Rocket, CodeSquare];

function ActionButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "tertiary";
}) {
  const resolvedHref = resolveSitePath(href);
  const classes =
    variant === "primary"
      ? "bg-accent-two text-surface hover:bg-accent-two/90"
      : variant === "secondary"
        ? "border border-accent-two/35 bg-surface/80 text-foreground hover:border-accent-two/55 hover:bg-accent-two/10"
        : "border border-accent-base/25 bg-transparent text-foreground hover:border-accent-base/45 hover:bg-accent-base/10";

  return (
    <a
      href={resolvedHref}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${classes}`}
      style={{ fontFamily: SANS_STACK }}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function HubMasthead({ content }: { content: HubPageContent }) {
  const isSpine = content.presentationStyle === "spine";
  const hasHeroFigure = Boolean(content.heroFigure);

  return (
    <section
      id="hero"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8"
    >
      <div
        className={`grid gap-8 ${hasHeroFigure ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end" : ""}`}
      >
        <div
          className={`space-y-6 rounded-[2.35rem] border border-[#ead7c3] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(245,241,232,0.93))] p-6 shadow-[0_20px_64px_-34px_rgba(24,24,27,0.24)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,25,31,0.96),rgba(16,18,23,0.92))] dark:shadow-[0_20px_64px_-34px_rgba(0,0,0,0.6)] sm:p-8 ${
            isSpine && hasHeroFigure ? "lg:order-2" : ""
          }`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full border border-accent-two/25 bg-accent-two/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              {content.eyebrow}
            </span>
            <span
              className="rounded-full border border-accent-base/15 bg-surface/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-color-500"
              style={{ fontFamily: SANS_STACK }}
            >
              {isSpine ? "Tutorial pathway" : "Docs overview"}
            </span>
          </div>

          <div className="space-y-4">
            <h1
              className="max-w-4xl text-4xl leading-[1.02] text-[#211b16] dark:text-[#f6f1e8] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: SERIF_STACK }}
            >
              {content.title}
            </h1>
            <p
              className="max-w-2xl text-base leading-8 text-[#5d5247] dark:text-[#c8c0b4] sm:text-lg"
              style={{ fontFamily: SANS_STACK }}
            >
              {content.description}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.7rem] border border-accent-base/15 bg-surface/90 p-5 shadow-[0_18px_52px_-30px_rgba(24,24,27,0.28)]">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
                style={{ fontFamily: SANS_STACK }}
              >
                Choose a path
              </p>
              <p
                className="mt-3 text-lg leading-tight text-foreground"
                style={{ fontFamily: SERIF_STACK }}
              >
                {isSpine
                  ? "Pick the next tutorial step"
                  : "Open the page that fits the question"}
              </p>
            </div>
            <div className="rounded-[1.7rem] border border-accent-base/15 bg-surface/90 p-5 shadow-[0_18px_52px_-30px_rgba(24,24,27,0.28)]">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
                style={{ fontFamily: SANS_STACK }}
              >
                Follow the path
              </p>
              <p
                className="mt-3 text-lg leading-tight text-foreground"
                style={{ fontFamily: SERIF_STACK }}
              >
                {isSpine
                  ? "Keep each proof step intact"
                  : "Read in the maintained order when you are new"}
              </p>
            </div>
            <div className="rounded-[1.7rem] border border-accent-base/15 bg-[#16171a] p-5 text-white shadow-[0_18px_52px_-30px_rgba(24,24,27,0.42)]">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f8c46d]"
                style={{ fontFamily: SANS_STACK }}
              >
                Ground truth
              </p>
              <p
                className="mt-3 text-lg leading-tight"
                style={{ fontFamily: SERIF_STACK }}
              >
                {isSpine
                  ? "Every step should leave you with something you can run or verify"
                  : "Every concept points back to a real surface or implementation"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {content.actions.map((action) => (
              <ActionButton
                key={`${content.eyebrow}-${action.href}`}
                href={action.href}
                label={action.label}
                variant={action.variant}
              />
            ))}
          </div>
        </div>

        {content.heroFigure ? (
          <figure
            className={`overflow-hidden rounded-[2rem] border border-accent-base/15 bg-surface/90 shadow-[0_24px_80px_-28px_rgba(24,24,27,0.35)] ${isSpine ? "lg:order-1" : ""}`}
          >
            <img
              src={resolveSitePath(content.heroFigure.src)}
              alt={content.heroFigure.alt}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
            <figcaption className="space-y-2 border-t border-accent-base/10 bg-surface-lighter/80 px-6 py-5">
              <p
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: SANS_STACK }}
              >
                {content.heroFigure.title}
              </p>
              <p
                className="text-sm leading-6 text-color-500"
                style={{ fontFamily: SANS_STACK }}
              >
                {content.heroFigure.caption}
              </p>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}

function DecisionStrip({ content }: { content: HubPageContent }) {
  if (!content.decisionPanels?.length) {
    return null;
  }

  const isSpine = content.presentationStyle === "spine";
  const accents = [
    "from-[#fff1e2] to-[#fff8ef] border-[#f6c38f]/55 dark:from-[#2b2014] dark:to-[#171b22] dark:border-[#f0b36b]/28",
    "from-[#fff8e0] to-[#fffcf0] border-[#efd37f]/50 dark:from-[#2a2413] dark:to-[#171b22] dark:border-[#d9c06f]/24",
    "from-[#ebfbf4] to-[#f5fffb] border-[#95d8c5]/45 dark:from-[#13211d] dark:to-[#171b22] dark:border-[#50c4b6]/24",
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={`grid gap-5 ${isSpine ? "lg:grid-cols-[1.15fr_0.85fr_1fr]" : "lg:grid-cols-3"}`}
      >
        {content.decisionPanels.map((panel, index) => (
          <a
            key={panel.title}
            href={resolveSitePath(panel.href)}
            className={`group rounded-[2rem] border bg-gradient-to-br p-6 shadow-[0_18px_48px_-30px_rgba(24,24,27,0.28)] transition-transform hover:-translate-y-0.5 ${accents[index % accents.length]}`}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              {panel.label}
            </p>
            <h2
              className="mt-3 text-2xl leading-tight text-foreground"
              style={{ fontFamily: SERIF_STACK }}
            >
              {panel.title}
            </h2>
            <p
              className="mt-3 text-sm leading-7 text-color-500"
              style={{ fontFamily: SANS_STACK }}
            >
              {panel.description}
            </p>
            <div
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              Open page
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function RouteAtlas({ content }: { content: HubPageContent }) {
  if (content.presentationStyle === "spine") {
    return (
      <section
        id="route-atlas"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="overflow-hidden rounded-[2.25rem] border border-accent-base/15 bg-surface/92 shadow-[0_24px_80px_-34px_rgba(24,24,27,0.28)]">
          <div className="border-b border-accent-base/10 px-6 py-8">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              Tutorial pathway
            </p>
            <h2
              className="mt-4 text-4xl leading-tight text-foreground"
              style={{ fontFamily: SERIF_STACK }}
            >
              Follow the steps in order so each page hands a real artifact to the next.
            </h2>
            <p
              className="mt-4 max-w-3xl text-sm leading-7 text-color-500"
              style={{ fontFamily: SANS_STACK }}
            >
              Tutorials should feel like a staged runbook. The pathway below is
              the maintained sequence, not a neutral list of pages.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-6">
            <div className="grid gap-4">
              {content.routeStages.map((stage, index) => (
                <a
                  key={`${stage.title}-${stage.href}`}
                  href={resolveSitePath(stage.href)}
                  className="group grid gap-0 overflow-hidden rounded-[1.8rem] border border-accent-base/12 bg-[linear-gradient(135deg,#fff8ee_0%,#fffdf9_62%,#eef9f5_100%)] shadow-[0_18px_52px_-34px_rgba(24,24,27,0.18)] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-[linear-gradient(135deg,#1b1f27_0%,#151920_62%,#101317_100%)] dark:shadow-[0_18px_52px_-34px_rgba(0,0,0,0.5)] md:grid-cols-[110px_minmax(0,1fr)]"
                >
                  <div className="flex items-center justify-center border-b border-accent-base/10 bg-[#16171a] px-5 py-6 text-white md:border-b-0 md:border-r">
                    <div className="text-center">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f8c46d]"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        Step
                      </p>
                      <p
                        className="mt-2 text-4xl leading-none"
                        style={{ fontFamily: SERIF_STACK }}
                      >
                        {index + 1}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] lg:items-start">
                    <div>
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        {stage.eyebrow}
                      </p>
                      <h3
                        className="mt-3 text-3xl leading-tight text-foreground"
                        style={{ fontFamily: SERIF_STACK }}
                      >
                        {stage.title}
                      </h3>
                      <p
                        className="mt-3 text-sm leading-7 text-color-500"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        {stage.description}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {stage.implementation ? (
                        <div className="rounded-[1.4rem] border border-accent-base/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-[#1b1f27]/84">
                          <p
                            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-two"
                            style={{ fontFamily: SANS_STACK }}
                          >
                            Backed by
                          </p>
                          <p
                            className="mt-2 text-sm leading-6 text-color-500"
                            style={{ fontFamily: SANS_STACK }}
                          >
                            {stage.implementation}
                          </p>
                        </div>
                      ) : null}
                      {stage.outcome ? (
                        <div className="rounded-[1.4rem] border border-accent-base/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-[#1b1f27]/84">
                          <p
                            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-two"
                            style={{ fontFamily: SANS_STACK }}
                          >
                            You will build
                          </p>
                          <p
                            className="mt-2 text-sm leading-6 text-color-500"
                            style={{ fontFamily: SANS_STACK }}
                          >
                            {stage.outcome}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="route-atlas"
      className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="overflow-hidden rounded-[2.25rem] border border-accent-base/15 bg-[#16171a] text-white shadow-[0_24px_80px_-34px_rgba(24,24,27,0.45)]">
        <div className="grid gap-0 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="border-b border-white/8 px-6 py-8 lg:border-b-0 lg:border-r">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f8c46d]"
              style={{ fontFamily: SANS_STACK }}
            >
              Learning path
            </p>
            <h2
              className="mt-4 text-4xl leading-tight"
              style={{ fontFamily: SERIF_STACK }}
            >
              Start with the path that matches what you are trying to learn.
            </h2>
            <p
              className="mt-4 text-sm leading-7 text-white/72"
              style={{ fontFamily: SANS_STACK }}
            >
              The overview below shows the maintained reading order. Every stage
              says what it teaches, what surface backs it, and what you should
              walk away able to do.
            </p>
          </div>

          <div className="grid gap-4 bg-[#1b1d20] p-5 sm:p-6 xl:grid-cols-2">
            {content.routeStages.map((stage, index) => (
              <a
                key={`${stage.title}-${stage.href}`}
                href={resolveSitePath(stage.href)}
                className="group rounded-[1.8rem] border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/18 hover:bg-white/8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f8c46d]"
                      style={{ fontFamily: SANS_STACK }}
                    >
                      {stage.eyebrow}
                    </p>
                    <h3
                      className="mt-3 text-2xl leading-tight text-white"
                      style={{ fontFamily: SERIF_STACK }}
                    >
                      {stage.title}
                    </h3>
                  </div>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-semibold text-white/76"
                    style={{ fontFamily: SANS_STACK }}
                  >
                    {index + 1}
                  </span>
                </div>
                <p
                  className="mt-3 text-sm leading-7 text-white/72"
                  style={{ fontFamily: SANS_STACK }}
                >
                  {stage.description}
                </p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {stage.implementation ? (
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f8c46d]"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        Backed by
                      </p>
                      <p
                        className="mt-2 text-sm leading-6 text-white/76"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        {stage.implementation}
                      </p>
                    </div>
                  ) : null}
                  {stage.outcome ? (
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f8c46d]"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        You leave with
                      </p>
                      <p
                        className="mt-2 text-sm leading-6 text-white/76"
                        style={{ fontFamily: SANS_STACK }}
                      >
                        {stage.outcome}
                      </p>
                    </div>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HubCardTile({
  card,
  iconIndex,
}: {
  card: HubCard;
  iconIndex: number;
}) {
  const Icon = ICONS[iconIndex % ICONS.length] ?? Book;

  return (
    <a
      href={resolveSitePath(card.href)}
      className="group flex h-full flex-col gap-4 rounded-[1.9rem] border border-accent-base/15 bg-surface/88 p-6 shadow-[0_18px_56px_-30px_rgba(24,24,27,0.26)] transition-transform hover:-translate-y-0.5 hover:border-accent-two/35"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border border-accent-base/15 bg-accent-base/6 px-3 py-3 text-accent-two">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {card.badge ? (
            <span
              className="rounded-full border border-accent-two/30 bg-accent-two/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              {card.badge}
            </span>
          ) : null}
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-color-500"
            style={{ fontFamily: SANS_STACK }}
          >
            {card.meta}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3
          className="text-2xl leading-tight text-foreground"
          style={{ fontFamily: SERIF_STACK }}
        >
          {card.title}
        </h3>
        <p
          className="text-sm leading-7 text-color-500"
          style={{ fontFamily: SANS_STACK }}
        >
          {card.description}
        </p>
      </div>

      {card.detailRows?.length ? (
        <div className="grid gap-3 rounded-[1.5rem] border border-accent-base/10 bg-surface-lighter/75 p-4">
          {card.detailRows.map((row) => (
            <div
              key={`${card.id}-${row.label}`}
              className="grid gap-1 md:grid-cols-[140px_minmax(0,1fr)]"
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-two"
                style={{ fontFamily: SANS_STACK }}
              >
                {row.label}
              </span>
              <span
                className="text-sm leading-6 text-color-500"
                style={{ fontFamily: SANS_STACK }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-accent-two"
        style={{ fontFamily: SANS_STACK }}
      >
        Open page
        <ArrowRight className="h-4 w-4" />
      </div>
    </a>
  );
}

function HubLane({
  section,
  index,
}: {
  section: HubPageContent["sections"][number];
  index: number;
}) {
  return (
    <section
      id={section.id}
      className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
        <div className={`${index % 2 === 1 ? "lg:order-2" : ""} space-y-5`}>
          <div className="rounded-[2rem] border border-accent-base/15 bg-surface/88 p-6 shadow-[0_18px_56px_-30px_rgba(24,24,27,0.26)]">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              Lane {index + 1}
            </p>
            <h2
              className="mt-4 text-4xl leading-tight text-foreground"
              style={{ fontFamily: SERIF_STACK }}
            >
              {section.title}
            </h2>
            <p
              className="mt-3 text-base leading-8 text-color-500"
              style={{ fontFamily: SANS_STACK }}
            >
              {section.subtitle}
            </p>
          </div>
        </div>

        <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
          <div className="grid gap-5 md:grid-cols-2">
            {section.cards.map((card, cardIndex) => (
              <HubCardTile
                key={card.id}
                card={card}
                iconIndex={index + cardIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HubFooter({ content }: { content: HubPageContent }) {
  const isSpine = content.presentationStyle === "spine";

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div
        className={`overflow-hidden rounded-[2.2rem] border border-accent-base/15 shadow-[0_24px_80px_-34px_rgba(24,24,27,0.45)] ${
          isSpine ? "bg-surface/92 text-foreground" : "bg-[#16171a] text-white"
        }`}
      >
        <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
          <div
            className={`border-b px-6 py-8 lg:border-b-0 lg:border-r ${
              isSpine ? "border-accent-base/10" : "border-white/8"
            }`}
          >
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                isSpine ? "text-accent-two" : "text-[#f8c46d]"
              }`}
              style={{ fontFamily: SANS_STACK }}
            >
              Use this hub well
            </p>
            <h2
              className="mt-4 text-4xl leading-tight"
              style={{ fontFamily: SERIF_STACK }}
            >
              {isSpine
                ? "Do not leave a tutorial stage without proving the artifact."
                : "Read until you can name the next concrete move."}
            </h2>
            <p
              className={`mt-4 text-sm leading-7 ${isSpine ? "text-color-500" : "text-white/72"}`}
              style={{ fontFamily: SANS_STACK }}
            >
              {isSpine
                ? "Tutorial pages should tell the reader what to run, what to inspect, and what the next stage depends on. If one of those is vague, the pathway still needs work."
                : "These hubs are supposed to reduce ambiguity. If a page or path does not make its scope, next move, and source surface clear, it still needs work."}
            </p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            {content.actions.map((action) => (
              <div
                key={`${content.eyebrow}-footer-${action.href}`}
                className={`rounded-[1.6rem] border p-5 ${
                  isSpine
                    ? "border-accent-base/12 bg-surface-lighter/80"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    isSpine ? "text-accent-two" : "text-[#f8c46d]"
                  }`}
                  style={{ fontFamily: SANS_STACK }}
                >
                  Next step
                </p>
                <p
                  className={`mt-3 text-lg leading-tight ${
                    isSpine ? "text-foreground" : "text-white"
                  }`}
                  style={{ fontFamily: SERIF_STACK }}
                >
                  {action.label}
                </p>
                <div className="mt-5">
                  <ActionButton
                    href={action.href}
                    label="Open page"
                    variant={action.variant}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HubPage({ content }: { content: HubPageContent }) {
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fcfbf7_38%,#f7f4ee_100%)] pb-20 dark:bg-[linear-gradient(180deg,#0f1114_0%,#12161b_42%,#0f1114_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-10 h-[32rem] w-[32rem] rounded-full bg-[#f97316]/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-48 h-[28rem] w-[28rem] rounded-full bg-[#0f766e]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#eab308]/8 blur-3xl" />
      </div>

      <div className="relative space-y-12">
        <HubMasthead content={content} />
        <DecisionStrip content={content} />
        <RouteAtlas content={content} />
        {content.sections.map((section, index) => (
          <HubLane key={section.id} section={section} index={index} />
        ))}
        <HubFooter content={content} />
      </div>
    </div>
  );
}
