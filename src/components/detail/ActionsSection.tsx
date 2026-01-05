import React from "react";
import { CallToActionButton } from "@/components/ui/CallToActionButton";

type Action = {
  label: string;
  url: string;
  variant?: "default" | "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  target?: string;
  rel?: string;
  indicatorText?: string;
};

interface ActionsSectionProps {
  actions?: Action[];
  title?: string;
}

export default function ActionsSection({
  actions,
  title,
}: ActionsSectionProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className={`content-section mb-8 `}>
      <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
        <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
          {title ? title : "ACTIONS"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, idx) => (
            <CallToActionButton
              key={`${action.url}-${idx}`}
              href={action.url}
              target={action.target || "_blank"}
              rel={action.rel || "noopener noreferrer"}
              variant={action.variant || "primary"}
              size={action.size || "medium"}
              indicatorText={action.indicatorText}
            >
              {action.label}
            </CallToActionButton>
          ))}
        </div>
      </div>
    </div>
  );
}
