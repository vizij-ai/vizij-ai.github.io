import { FaceFramePlaceholder } from "@/components/demos/FaceFramePlaceholder";
import Section from "@/components/sections/Section";
import {
  ArrowRight,
  CheckCircle,
  PlayCircle,
} from "@solar-icons/react-perf/LineDuotone";
import type { ReactNode } from "react";

export function TutorialLabPlaceholder({
  id,
  title,
  subtitle,
  trySteps,
  successSignal,
  note,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  trySteps: readonly string[];
  successSignal: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <Section id={id} title={title} subtitle={subtitle} variant="primary">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-accent-base/20 bg-surface-lighter/50 p-6">
            <div className="flex items-center gap-3 text-accent-two">
              <PlayCircle className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                Try this
              </p>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-color-500">
              {trySteps.map((step) => (
                <li key={step} className="flex gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-accent-base/20 bg-special-lighter/70 p-6">
            <div className="flex items-center gap-3 text-accent-two">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                Success signal
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-color-500">
              {successSignal}
            </p>
            {note ? (
              <p className="mt-4 text-sm leading-6 text-color-500">{note}</p>
            ) : null}
          </div>
        </div>
        <div>
          {children ?? (
            <FaceFramePlaceholder
              variant="lg"
              label="Runnable lab"
              subtitle="This runtime loads after the section enters view."
            />
          )}
        </div>
      </div>
    </Section>
  );
}
