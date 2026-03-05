import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import FeatureCard from "@/components/cards/FeatureCard";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import {
  SettingsMinimalistic,
  BoxMinimalistic,
  Database,
  CartLarge2,
  Delivery,
  HeadphonesRound,
  Code2,
  UsersGroupTwoRounded,
  ShieldCheck,
  Document,
  SquareAcademicCap,
  TestTube,
  Chart2,
  VerifiedCheck,
  Rocket,
} from "@solar-icons/react-perf/LineDuotone";
import HugeUserGroup from "@/components/icons/HugeUserGroup";
import { UserHandUp } from "@solar-icons/react-perf/LineDuotone";
import React from "react";

type IconComponent = React.ComponentType<{ className?: string }>;

type ServiceDefinition = {
  icon: IconComponent;
  title: string;
  subtitle?: string;
  description: string;
};

const hardwareServices: ServiceDefinition[] = [
  {
    icon: SettingsMinimalistic,
    title: "Design",
    subtitle: "Design for Manufacturing",
    description:
      "Expert guidance on making your robotic designs ready for scale manufacturing",
  },
  {
    icon: BoxMinimalistic,
    title: "Manufacturing",
    subtitle: "Contract Manufacturing",
    description:
      "End-to-end scale manufacturing services for robotics hardware",
  },
  {
    icon: Database,
    title: "Inventory",
    subtitle: "Inventory Management",
    description: "Storage and inventory solutions for robotics components",
  },
  {
    icon: CartLarge2,
    title: "Sales",
    subtitle: "Sales & Distribution",
    description:
      "Make your hardware available to the broader robotics community",
  },
  {
    icon: Delivery,
    title: "Shipping",
    subtitle: "Global Shipping",
    description: "Worldwide distribution of your robotics hardware platforms",
  },
  {
    icon: HeadphonesRound,
    title: "Support",
    subtitle: "Technical Support",
    description:
      "Ongoing technical support for your robotics hardware platforms",
  },
];

const softwareServices: ServiceDefinition[] = [
  {
    icon: Code2,
    title: "Code Refactoring",
    subtitle: "Code Translation",
    description:
      "Transform research code into production-ready software with industry best practices",
  },
  {
    icon: UsersGroupTwoRounded,
    title: "Community Pool",
    subtitle: "Open Source Bounties",
    description:
      "Contribute to open projects and earn rewards for solving community challenges",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    subtitle: "Testing & Validation",
    description:
      "Comprehensive testing and validation for robotics applications",
  },
  {
    icon: Document,
    title: "Documentation",
    subtitle: "Technical Writing",
    description: "Clear, comprehensive documentation for all software projects",
  },
  {
    icon: SquareAcademicCap,
    title: "Training",
    subtitle: "Workshops & Tutorials",
    description: "Learn best practices for developing HRI software systems",
  },
  {
    icon: HeadphonesRound,
    title: "Support",
    subtitle: "Cloud & Edge Support",
    description:
      "Ongoing technical support for your robotics software tools and frameworks",
  },
];

const researchServices: ServiceDefinition[] = [
  {
    icon: TestTube,
    title: "Replication Studies",
    description:
      "Plan, pre-register, and execute confirmatory studies with standardized protocols",
  },
  {
    icon: Document,
    title: "Grants",
    description:
      "Identify, develop, and coordinate submissions for research funding",
  },
  {
    icon: UsersGroupTwoRounded,
    title: "Broader Impacts",
    description:
      "Design and deliver activities and artifacts that meet program requirements",
  },
  {
    icon: SquareAcademicCap,
    title: "Events",
    description:
      "Plan, host, and support workshops, user studies, and symposia for the community",
  },
  {
    icon: HugeUserGroup,
    title: "Populations",
    description:
      "Recruit diverse in-person and remote participants, including special populations",
  },
  {
    icon: Chart2,
    title: "Analysis",
    description:
      "Build robust pipelines for data cleaning, statistical modeling, and visualization",
  },
];

export default function ServicesPage() {
  return (
    <>
      <HeroHeader
        fullBleed
        icon={<UserHandUp className="w-16 h-16 text-accent-two" />}
        title="Services"
        description="Comprehensive support services to accelerate your robotics development, from hardware manufacturing to software deployment and research facilitation."
        actions={[
          { label: "Hardware Services", href: "#hardware", indicatorText: "6" },
          {
            label: "Software Services",
            href: "#software",
            variant: "secondary",
            indicatorText: "6",
          },
          {
            label: "Research Services",
            href: "#research",
            variant: "tertiary",
            indicatorText: "6",
          },
        ]}
      />

      <Section
        id="hardware"
        title="Hardware Services"
        subtitle="Comprehensive support for scaling robotics hardware development and deployment"
        variant="primary"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hardwareServices.map((service) => (
              <FeatureCard
                key={service.title}
                title={service.title}
                description={service.description}
                variant="primary"
                iconComponent={service.icon}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-color-600 dark:text-color-400 mb-6">
              From initial design to global distribution, we provide end-to-end
              support for your robotics hardware projects.
            </p>
            <CallToActionButton
              href="https://forms.gle/5iiaThSsGUMzXWsu6"
              size="large"
            >
              Request Hardware Services
            </CallToActionButton>
          </div>
        </div>
      </Section>

      <Section
        id="software"
        title="Software Services"
        subtitle="Supporting the transition from research code to production-ready systems"
        variant="secondary"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareServices.map((service) => (
              <FeatureCard
                key={service.title}
                title={service.title}
                description={service.description}
                variant="secondary"
                iconComponent={service.icon}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-color-600 dark:text-color-400 mb-6">
              Transform your research code into robust, production-ready systems
              with our comprehensive software services.
            </p>
            <CallToActionButton
              href="https://forms.gle/5iiaThSsGUMzXWsu6"
              size="large"
              variant="secondary"
            >
              Request Software Services
            </CallToActionButton>
          </div>
        </div>
      </Section>

      <Section
        id="research"
        title="Research Services"
        subtitle="Comprehensive support for conducting replicable HRI research and studies"
        variant="tertiary"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchServices.map((service) => (
              <FeatureCard
                key={service.title}
                title={service.title}
                description={service.description}
                variant="tertiary"
                iconComponent={service.icon}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-color-600 dark:text-color-400 mb-6">
              Enable reproducible, scalable research with our comprehensive
              study support services.
            </p>
            <CallToActionButton
              href="https://forms.gle/5iiaThSsGUMzXWsu6"
              size="large"
              variant="tertiary"
            >
              Request Research Services
            </CallToActionButton>
          </div>
        </div>
      </Section>

      <Section
        id="benefits"
        title="Why Choose Our Services?"
        subtitle="Benefits of working with the Semio Community"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <VerifiedCheck className="w-10 h-10 text-accent-one shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Community-Driven</h3>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Benefit from collective expertise and shared resources across
                  the entire HRI community.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Rocket className="w-10 h-10 text-accent-two shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Accelerate Development</h3>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Speed up your time to market with proven solutions and expert
                  guidance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-10 h-10 text-special shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Quality Assurance</h3>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Ensure reliability and robustness with industry-standard
                  testing and validation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <UsersGroupTwoRounded className="w-10 h-10 text-green-500 shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Global Network</h3>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Connect with researchers, developers, and industry partners
                  worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="process"
        title="How It Works"
        subtitle="Simple steps to access our services"
      >
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Contact Us",
                description:
                  "Reach out through our Get Involved page to discuss your project needs and requirements.",
              },
              {
                step: "2",
                title: "Consultation",
                description:
                  "We'll work with you to understand your goals and recommend the best services for your needs.",
              },
              {
                step: "3",
                title: "Implementation",
                description:
                  "Our expert team will deliver the services, keeping you informed throughout the process.",
              },
              {
                step: "4",
                title: "Ongoing Support",
                description:
                  "Continue to benefit from community support and updates as your project evolves.",
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-base/20 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-accent-base">
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="get-started">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-color-600 dark:text-color-400">
            Whether you're developing hardware, software, or conducting
            research, our services can help you achieve your goals faster and
            more effectively.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CallToActionButton
              href="https://forms.gle/5iiaThSsGUMzXWsu6"
              size="large"
            >
              Request Services
            </CallToActionButton>
          </div>
        </div>
      </Section>
    </>
  );
}
