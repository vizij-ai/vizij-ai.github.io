import {
	DetailHero as CoreDetailHero,
	type DetailHeroBadge as CoreDetailHeroBadge,
	type DetailHeroProps as CoreDetailHeroProps,
	type DetailHeroAvatarRenderProps,
	type DetailHeroFeaturedRenderProps,
} from "@semio-community/ecosystem-site-core";
import { Avatar, type AvatarType, FeaturedStar } from "@semio-community/ecosystem-site-core";
import type React from "react";

export type DetailHeroProps = Omit<CoreDetailHeroProps, "renderAvatar" | "renderFeaturedStar">;
export type DetailHeroBadge = CoreDetailHeroBadge;

function renderAvatar(props: DetailHeroAvatarRenderProps) {
	const avatarTypeMap: Record<string, AvatarType> = {
		person: "person",
		organization: "organization",
		hardware: "hardware",
		software: "software",
		research: "research",
		event: "event",
	};

	return (
		<Avatar
			src={
				// biome-ignore lint/suspicious/noExplicitAny: Astro image type not assignable to shared Avatar src
				props.image as any
			}
			alt={props.alt}
			name={props.name}
			type={avatarTypeMap[props.entityType] ?? "organization"}
			size="2xl"
			rounded="full"
			className={props.className}
		/>
	);
}

function renderFeaturedStar(props: DetailHeroFeaturedRenderProps) {
	return <FeaturedStar state={props.state} size={props.size} glow className={props.className} />;
}

export const DetailHero: React.FC<DetailHeroProps> = (props) => {
	return (
		<CoreDetailHero
			{...props}
			renderAvatar={renderAvatar}
			renderFeaturedStar={renderFeaturedStar}
		/>
	);
};
