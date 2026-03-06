import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import { CallToActionButton } from "@semio-community/ecosystem-site-core";
import {
  ShieldCheck,
  Eye,
  Target,
  Buildings2,
  Gift,
  HandMoney,
  Letter,
  CalendarMark,
  TestTube,
  UsersGroupTwoRounded,
} from "@solar-icons/react-perf/LineDuotone";
import { CheckCircle } from "@solar-icons/react-perf/Bold";
import { UserPlusRounded } from "@solar-icons/react-perf/LineDuotone";

export default function GetInvolvedPage() {
  return (
    <>
      <HeroHeader
        fullBleed
        icon={<UserPlusRounded className="w-16 h-16 text-accent-two" />}
        title="Get Involved"
        description={
          <>
            Be part of a global community advancing human-centered robotics and
            AI. Your support helps us foster reproducible science and develop
            reusable systems for human-robot interaction.
          </>
        }
        actions={[
          { label: "Make a Donation", href: "#donate" },
          { label: "Volunteer", href: "#volunteer", variant: "secondary" },
          {
            label: "Join the Mailing List",
            href: "#mailing-list",
            variant: "tertiary",
          },
        ]}
      />

      {/* Donate Section */}
      <Section
        id="donate"
        title="Support Semio Community"
        subtitle="Your donations enable us to advance open science in robotics"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-accent-one/10 to-accent-two/10 rounded-lg p-8 border border-accent-two/20 mb-8 backdrop-blur-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center text-accent-base">
              Why Your Support Matters
            </h3>
            <p className="text-center mb-6 text-color-600 dark:text-color-400">
              As a 501(c)(3) nonprofit organization, we rely on donations to
              sustain our mission of making robotics research more accessible,
              reproducible, and impactful.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-accent-two" />
                <h4 className="font-semibold mb-2">Tax Deductible</h4>
                <p className="text-sm text-color-600 dark:text-color-400">
                  All donations are tax-deductible to the fullest extent of the
                  law
                </p>
              </div>
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-3 text-accent-two" />
                <h4 className="font-semibold mb-2">Transparent</h4>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Annual reports show exactly how your donations are used
                </p>
              </div>
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-3 text-accent-two" />
                <h4 className="font-semibold mb-2">Impactful</h4>
                <p className="text-sm text-color-600 dark:text-color-400">
                  100% of donations directly support our programs and
                  initiatives
                </p>
              </div>
            </div>

            <div className="text-center">
              <CallToActionButton
                href="https://donate.stripe.com/cNiaEX4ZE07R8Wj8Yva7C00"
                size="large"
              >
                Donate Now
              </CallToActionButton>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-6 border border-special">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Other Ways to Give
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Buildings2 className="w-10 h-10 mx-auto mb-3 text-accent-two" />
                <h4 className="font-semibold mb-2">Corporate Sponsorship</h4>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Partner with us through corporate giving programs
                </p>
              </div>
              <div>
                <Gift className="w-10 h-10 mx-auto mb-3 text-accent-two" />
                <h4 className="font-semibold mb-2">In-Kind Donations</h4>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Donate equipment, software licenses, or services
                </p>
              </div>
              <div>
                <HandMoney className="w-10 h-10 mx-auto mb-3 text-accent-two" />
                <h4 className="font-semibold mb-2">Planned Giving</h4>
                <p className="text-sm text-color-600 dark:text-color-400">
                  Include Semio Community in your estate planning
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Volunteer Section */}
      <Section
        id="volunteer"
        title="Join the Community"
        subtitle="Share your skills and passion to advance human-centered robotics and AI"
        variant="secondary"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-accent-one/10 to-accent-two/10 rounded-lg p-8 border border-accent-two/20 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-6 text-center text-accent-base">
              Volunteer Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-one flex-shrink-0 mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">Professional Network</h4>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    Connect with researchers and professionals in robotics and
                    AI
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-one flex-shrink-0 mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">Skill Development</h4>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    Gain hands-on experience with cutting-edge robotics and AI
                    technologies
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-one flex-shrink-0 mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">Recognition</h4>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    Receive certificates and LinkedIn recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-one flex-shrink-0 mt-2" />
                <div>
                  <h4 className="font-semibold mb-1">Flexible Commitment</h4>
                  <p className="text-sm text-color-600 dark:text-color-400">
                    Choose projects that fit your schedule and interests
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <CallToActionButton
                href="https://forms.gle/5iiaThSsGUMzXWsu6"
                size="large"
                variant="secondary"
              >
                Sign Up as Volunteer
              </CallToActionButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Mailing List Section */}
      <Section
        id="mailing-list"
        title="Join Our Mailing List"
        subtitle="Stay connected with the latest news, events, and opportunities"
        variant="tertiary"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-special-lighter rounded-lg p-8 border border-special backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  What You'll Receive:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Letter className="w-5 h-5 text-accent-three flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Regular newsletter with community updates
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CalendarMark className="w-5 h-5 text-accent-three flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Early announcements for events and workshops
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TestTube className="w-5 h-5 text-accent-three flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Research highlights and findings
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UsersGroupTwoRounded className="w-5 h-5 text-accent-three flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Volunteer and collaboration opportunities
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Sign Up:</h3>
                <CallToActionButton
                  size="large"
                  variant="tertiary"
                  fullWidth
                  href="https://forms.gle/5iiaThSsGUMzXWsu6"
                >
                  Connect with Us
                </CallToActionButton>
              </div>
            </div>

            <div className="text-center text-sm text-color-600 dark:text-color-400">
              <p>
                We respect your privacy and never share your information with
                third parties.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
