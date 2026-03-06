import React from "react";
import SectionBlock from "@/components/sections/SectionBlock";
import { CallToActionButton } from "@semio-community/ecosystem-site-core";

export interface ConnectSectionProps {
  /**
   * Section id (anchor target). Defaults to "connect".
   */
  id?: string;
  /**
   * Section heading. Defaults to "Connect With Us".
   */
  title?: string;
  /**
   * Section subheading (under the title).
   * Defaults to the homepage copy.
   */
  subtitle?: string;
  /**
   * Optional aria-label for the section wrapper.
   * If not provided, the title is used.
   */
  ariaLabel?: string;
  /**
   * Additional class names applied to the outer section element.
   */
  className?: string;
  /**
   * Class names applied to the CTA grid wrapper.
   */
  gridClassName?: string;
  /**
   * Donation link. Defaults to the current site Stripe link.
   */
  donateHref?: string;
  /**
   * Volunteer link. Defaults to the current site Google Form.
   */
  volunteerHref?: string;
  /**
   * Mailing list link. Defaults to the current site Google Form.
   */
  mailingListHref?: string;
  /**
   * Custom CTA labels (optional).
   */
  donateText?: string;
  volunteerText?: string;
  mailingListText?: string;
}

/**
 * ConnectSection
 *
 * Renders the "Connect With Us" section used on the homepage with a
 * three-column CTA grid: Donate, Volunteer, and Join the Mailing List.
 * Uses the shared SectionBlock and CallToActionButton components.
 */
export default function ConnectSection({
  id = "connect",
  title = "Connect With Us",
  subtitle = "Join our community and stay informed about our initiatives",
  ariaLabel,
  className,
  gridClassName,
  donateHref = "https://donate.stripe.com/cNiaEX4ZE07R8Wj8Yva7C00",
  volunteerHref = "https://forms.gle/5iiaThSsGUMzXWsu6",
  mailingListHref = "https://forms.gle/5iiaThSsGUMzXWsu6",
  donateText = "Make a Donation",
  volunteerText = "Volunteer",
  mailingListText = "Join the Mailing List",
}: ConnectSectionProps) {
  return (
    <SectionBlock
      id={id}
      title={title}
      subtitle={subtitle}
      ariaLabel={ariaLabel || title}
      className={className}
    >
      <div
        className={
          gridClassName ??
          "grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 gap-10 bg-accent-base/10 p-10 rounded-lg backdrop-blur-lg"
        }
      >
        <CallToActionButton
          href={donateHref}
          size="large"
          variant="primary"
          fullWidth
          ariaLabel="Make a donation"
        >
          {donateText}
        </CallToActionButton>

        <CallToActionButton
          href={volunteerHref}
          size="large"
          variant="secondary"
          fullWidth
          ariaLabel="Volunteer with Semio Community"
        >
          {volunteerText}
        </CallToActionButton>

        <CallToActionButton
          href={mailingListHref}
          size="large"
          variant="tertiary"
          fullWidth
          ariaLabel="Join the Semio Community mailing list"
        >
          {mailingListText}
        </CallToActionButton>
      </div>
    </SectionBlock>
  );
}
