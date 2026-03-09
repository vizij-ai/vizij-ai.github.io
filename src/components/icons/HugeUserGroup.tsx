import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";

/**
 * HugeUserGroup
 *
 * Lightweight React wrapper around Hugeicons' "UserGroup" icon to provide a
 * consistent, component-style API that mirrors other React icon usage.
 *
 * Usage:
 *   import HugeUserGroup from "@/components/icons/HugeUserGroup";
 *   ...
 *   <HugeUserGroup className="w-12 h-12 text-accent-two" />
 *
 * Notes:
 * - Accepts standard SVG props (e.g., className).
 * - Defaults to aria-hidden for decorative use; pass role/title if used as a semantic icon.
 */
export type HugeUserGroupProps = {
	className?: string;
	ariaLabel?: string;
	role?: React.AriaRole;
	title?: string;
};

export const HugeUserGroup: React.FC<HugeUserGroupProps> = ({
	className,
	ariaLabel,
	role,
	title,
}) => {
	return (
		<HugeiconsIcon
			icon={UserGroupIcon}
			className={className}
			aria-label={ariaLabel}
			role={role}
			aria-hidden={ariaLabel || role === "img" ? undefined : true}
		/>
	);
};

export default HugeUserGroup;
