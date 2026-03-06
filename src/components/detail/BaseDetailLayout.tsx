import type { ReactNode } from "react";
import { clsx } from "clsx";

type SectionContent = ReactNode | string | null | undefined;

export interface BaseDetailLayoutProps {
  className?: string;
  breadcrumbs?: SectionContent;
  hero?: SectionContent;
  actions?: SectionContent;
  links?: SectionContent;
  description?: SectionContent;
  contributors?: SectionContent;
  metadata?: SectionContent;
  specifications?: SectionContent;
  features?: SectionContent;
  tags?: SectionContent;
  stats?: SectionContent;
  content?: SectionContent;
  related?: SectionContent;
  footer?: SectionContent;
}

export default function BaseDetailLayout({
  className,
  breadcrumbs,
  hero,
  actions,
  links,
  description,
  contributors,
  metadata,
  specifications,
  features,
  tags,
  stats,
  content,
  related,
  footer,
}: BaseDetailLayoutProps) {
  const renderSection = (section?: SectionContent) => {
    if (section == null || section === "") return null;
    return <>{section}</>;
  };

  return (
    <>
      <article
        className={clsx(
          "detail-layout w-full min-h-screen",
          className,
        )}
      >
        {renderSection(breadcrumbs) && (
          <nav className="mb-6 px-4 md:px-8 lg:px-12" aria-label="Breadcrumb">
            {renderSection(breadcrumbs)}
          </nav>
        )}

        {renderSection(hero)}

        {renderSection(links) && (
          <section className="links-section mb-8">
            {renderSection(links)}
          </section>
        )}

        {renderSection(actions) && (
          <section className="mb-8">{renderSection(actions)}</section>
        )}

        {renderSection(description) && (
          <section className="description-section mb-8">
            {renderSection(description)}
          </section>
        )}

        {renderSection(contributors) && (
          <section className="contributors-section mb-8">
            {renderSection(contributors)}
          </section>
        )}

        {renderSection(metadata) && (
          <section className="metadata-section mb-8">
            {renderSection(metadata)}
          </section>
        )}

        {renderSection(specifications) && (
          <section className="specifications-section mb-8">
            {renderSection(specifications)}
          </section>
        )}

        {renderSection(features) && (
          <section className="features-section mb-8">
            {renderSection(features)}
          </section>
        )}

        {renderSection(tags) && (
          <section className="tags-section mb-8">{renderSection(tags)}</section>
        )}

        {renderSection(stats) && (
          <section className="stats-section mb-8">
            {renderSection(stats)}
          </section>
        )}

        {renderSection(content) && (
          <section className="prose-content mb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {renderSection(content)}
            </div>
          </section>
        )}

        {renderSection(related) && (
          <section className="related-section mt-12">
            {renderSection(related)}
          </section>
        )}

        {renderSection(footer) && (
          <footer className="footer-section mt-12 pt-8 border-t border-accent-one/10">
            {renderSection(footer)}
          </footer>
        )}
      </article>

      <style>
        {`
          .detail-layout section {
            animation: fadeIn 0.3s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media print {
            .detail-layout {
              padding-top: 0 !important;
            }

            .detail-layout section {
              break-inside: avoid;
            }
          }
        `}
      </style>
    </>
  );
}
