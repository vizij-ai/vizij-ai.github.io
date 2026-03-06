import React from "react";
import Section from "@/components/sections/Section";
import { CallToActionButton } from "@semio-community/ecosystem-site-core";
import { url } from "@/utils/url";
import { Icon } from "@/components/ui/Icon";

const partnerPillars = [
  {
    icon: "solar:square-academic-cap-line-duotone",
    title: "Academia",
    description:
      "Supporting research institutions with tools and infrastructure",
  },
  {
    icon: "solar:buildings-2-line-duotone",
    title: "Industry",
    description:
      "Bridging the gap between research and commercial applications",
  },
  {
    icon: "solar:flag-2-line-duotone",
    title: "Public Sector",
    description:
      "Partnering with government to advance robotics policy and standards",
  },
];

const whatWeDo = [
  {
    icon: "solar:cpu-bolt-line-duotone",
    title: "Hardware Development & Support",
    description:
      "We facilitate the development, manufacturing, and distribution of open-source robotics hardware platforms, making advanced research tools accessible to institutions worldwide.",
  },
  {
    icon: "solar:code-square-line-duotone",
    title: "Software & Tools Development",
    description:
      "We create and maintain open-source software libraries, frameworks, and tools that enable researchers to build upon each other's work and accelerate innovation in HRI.",
  },
  {
    icon: "solar:test-tube-line-duotone",
    title: "Research Infrastructure",
    description:
      "We provide shared research infrastructure including study protocols, data repositories, and analysis tools that promote reproducible science in human-robot interaction.",
  },
  {
    icon: "solar:users-group-two-rounded-line-duotone",
    title: "Community Building",
    description:
      "We organize conferences, workshops, and training events that bring together researchers, practitioners, and students to share knowledge and collaborate on advancing the field.",
  },
];

const legalCards = [
  {
    title: "Tax-Exempt Status",
    body: (
      <>
        <p className="text-sm text-color-600 dark:text-color-400 mb-3">
          Semio Community is recognized as a tax-exempt organization under
          section 501(c)(3) of the Internal Revenue Code. Donations are
          tax-deductible to the extent allowed by law.
        </p>
        <p className="text-sm">
          <strong>EIN:</strong> 93-2156692
        </p>
      </>
    ),
  },
  {
    title: "Transparency",
    body: (
      <p className="text-sm text-color-600 dark:text-color-400">
        We operate with full transparency and accountability. Financial reports,
        board meetings, and program updates are made available to our community
        and supporters.
      </p>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <Section
        id="mission"
        title="Our Mission"
        subtitle="Advancing human-centered robotics through community collaboration"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accent-one/10 to-accent-two/10 rounded-lg p-8 border border-accent-one/20 mb-8">
            <p className="text-lg leading-relaxed text-center">
              Semio Community is a{" "}
              <span className="font-semibold">
                501(c)(3) nonprofit organization
              </span>{" "}
              facilitating community-driven robotics hardware, software, and
              research to foster repeatable, reproducible, and replicable
              science and reusable systems within human-robot interaction (HRI).
            </p>
          </div>
          <p className="text-center text-color-600 dark:text-color-400">
            Founded with the belief that the future of robotics lies in
            collaborative innovation, we work to break down barriers between
            research and application, making cutting-edge robotics technology
            accessible to researchers, educators, and developers worldwide.
          </p>
        </div>
      </Section>

      <Section
        id="partners"
        title="Our Partners"
        subtitle="Building the future of human-centered robotics and AI together"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accent-one/10 to-accent-two/10 rounded-lg p-8 border border-accent-one/20 mb-8">
            <p className="text-lg leading-relaxed text-center mb-6">
              Semio Community actively encourages multidisciplinary
              collaboration among academia, industry, and the public sector to
              drive innovation, ethical practices, and the widespread adoption
              of human-centered robotics technologies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partnerPillars.map((pillar) => (
                <div key={pillar.title} className="text-center">
                  <Icon
                    name={pillar.icon}
                    className="w-12 h-12 mx-auto mb-3 text-accent-two"
                  />
                  <h3 className="font-semibold mb-2">{pillar.title}</h3>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="what-we-do"
        title="What We Do"
        subtitle="Our key initiatives and programs"
      >
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {whatWeDo.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-6 bg-special-lighter rounded-lg"
              >
                <Icon
                  name={item.icon}
                  className="w-10 h-10 text-accent-two flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="history"
        title="Our Story"
        subtitle="The journey of Semio Community"
      >
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-citrus max-w-none text-color-600 dark:text-color-400">
            <p>
              Semio Community was founded on the principle that the most
              significant advances in robotics come not from isolated efforts,
              but from collaborative innovation. Recognizing the challenges
              researchers face in accessing hardware, replicating research, and
              building upon existing work, we set out to create an organization
              that would address these fundamental barriers.
            </p>
            <p>
              As a 501(c)(3) nonprofit, we operate with complete transparency
              and dedication to our mission. Every dollar donated and every hour
              volunteered directly supports our programs to advance open science
              in robotics.
            </p>
            <p>
              Today, we're proud to support a global community of researchers,
              educators, and developers who share our vision of making robotics
              technology more accessible, reproducible, and impactful for
              society.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="contact"
        title="Contact"
        subtitle="Get in touch with Semio Community"
      >
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-gradient-to-r from-accent-one/10 to-accent-two/10 rounded-lg border border-accent-one/20 text-center">
            <Icon
              name="solar:user-circle-line-duotone"
              className="w-20 h-20 mx-auto mb-4 text-accent-two"
            />
            <h3 className="text-xl font-semibold mb-1 gradient-brand-text">
              Ross Mead
            </h3>
            <p className="text-sm text-color-600 dark:text-color-400">
              ross@semio.community
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="contact-details"
        title="Contact Us"
        subtitle="Get in touch with Semio Community"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface rounded-lg p-8 border border-special">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 gradient-brand-text">
                  General Inquiries
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon
                      name="solar:letter-line-duotone"
                      className="w-5 h-5 text-accent-two flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <a
                        href="mailto:ross@semio.community"
                        className="text-sm text-link hover:underline"
                      >
                        ross@semio.community
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon
                      name="solar:map-point-line-duotone"
                      className="w-5 h-5 text-accent-two flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-medium mb-1">Legal Status</p>
                      <p className="text-sm text-color-600 dark:text-color-400">
                        501(c)(3) Tax-Exempt Nonprofit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 gradient-brand-text">
                  Connect With Us
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-color-600 dark:text-color-400">
                    Follow us on social media and join our mailing list to stay
                    updated on our latest initiatives, events, and
                    opportunities.
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/semio-community"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-color-600 hover:text-accent-one transition-colors"
                      aria-label="GitHub"
                    >
                      <Icon name="mdi:github" className="w-6 h-6" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/semio-community"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-color-600 hover:text-accent-one transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Icon name="mdi:linkedin" className="w-6 h-6" />
                    </a>
                    <a
                      href="https://twitter.com/semiocommunity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-color-600 hover:text-accent-one transition-colors"
                      aria-label="Twitter"
                    >
                      <Icon name="mdi:twitter" className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-special text-center">
              <p className="text-sm text-color-600 dark:text-color-400 mb-4">
                Have a question or want to learn more about our work?
              </p>
              <CallToActionButton href={url("/#connect")} size="large">
                Join Our Mailing List
              </CallToActionButton>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="legal"
        title="Legal Information"
        subtitle="Transparency and compliance"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalCards.map((card) => (
              <div
                key={card.title}
                className="p-6 bg-special-lighter rounded-lg"
              >
                <h3 className="font-semibold mb-3">{card.title}</h3>
                {card.body}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
