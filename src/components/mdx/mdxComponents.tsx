import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, ComponentType, ElementType } from "react";

type ElementProps<Tag extends ElementType> = ComponentPropsWithoutRef<Tag>;
// biome-ignore lint/suspicious/noExplicitAny: MDX component map accepts any component type
export type MDXComponentMap = Record<string, ComponentType<any>>;

const headingBase = "text-accent-base font-semibold tracking-tight";
const bodyText = "text-color-800 dark:text-color-100 leading-8";

export const mdxComponents: MDXComponentMap = {
	h1: (props: ElementProps<"h1">) => (
		<h1
			{...props}
			className={clsx(headingBase, "text-3xl md:text-4xl mt-12 mb-4", props.className)}
		/>
	),
	h2: (props: ElementProps<"h2">) => (
		<h2
			{...props}
			className={clsx(headingBase, "text-2xl md:text-3xl mt-10 mb-4", props.className)}
		/>
	),
	h3: (props: ElementProps<"h3">) => (
		<h3
			{...props}
			className={clsx(headingBase, "text-xl md:text-2xl mt-8 mb-3", props.className)}
		/>
	),
	h4: (props: ElementProps<"h4">) => (
		<h4
			{...props}
			className={clsx(
				"text-lg md:text-xl font-semibold text-accent-base mt-6 mb-3",
				props.className,
			)}
		/>
	),
	p: (props: ElementProps<"p">) => (
		<p
			{...props}
			className={clsx(bodyText, "my-4 dark:text-neutral-200 text-neutral-800", props.className)}
		/>
	),
	a: (props: ElementProps<"a">) => (
		<a
			{...props}
			className={clsx(
				"text-accent-three underline decoration-2 underline-offset-4 transition-colors hover:text-accent-one",
				props.className,
			)}
		/>
	),
	ul: (props: ElementProps<"ul">) => (
		<ul
			{...props}
			className={clsx(
				bodyText,
				"my-4 list-disc space-y-2 pl-6 marker:text-accent-one",
				props.className,
			)}
		/>
	),
	ol: (props: ElementProps<"ol">) => (
		<ol
			{...props}
			className={clsx(
				bodyText,
				"my-4 list-decimal space-y-2 pl-6 marker:text-accent-one",
				props.className,
			)}
		/>
	),
	li: (props: ElementProps<"li">) => (
		<li {...props} className={clsx(bodyText, "leading-8", props.className)} />
	),
	blockquote: (props: ElementProps<"blockquote">) => (
		<blockquote
			{...props}
			className={clsx(
				"my-6 border-l-4 border-accent-one/60 bg-accent-one/8 px-4 py-3 rounded-r-xl italic text-color-800 dark:text-color-50",
				props.className,
			)}
		/>
	),
	code: (props: ElementProps<"code">) => (
		<code
			{...props}
			className={clsx(
				"bg-(--code-inline-bg) px-2 py-1 rounded-md font-mono text-sm text-accent-base",
				props.className,
			)}
		/>
	),
	pre: (props: ElementProps<"pre">) => (
		<pre
			{...props}
			className={clsx(
				"my-6 rounded-xl border border-accent-one/10 bg-(--code-bg) px-4 py-3 overflow-x-auto text-sm",
				props.className,
			)}
		/>
	),
	hr: (props: ElementProps<"hr">) => (
		<hr {...props} className={clsx("my-10 border-t border-accent-one/30", props.className)} />
	),
	table: (props: ElementProps<"table">) => (
		<table
			{...props}
			className={clsx(
				"my-6 w-full border-collapse text-sm overflow-hidden rounded-xl",
				props.className,
			)}
		/>
	),
	thead: (props: ElementProps<"thead">) => (
		<thead {...props} className={clsx("bg-accent-one/10", props.className)} />
	),
	th: (props: ElementProps<"th">) => (
		<th
			{...props}
			className={clsx(
				"text-left font-semibold text-accent-base px-3 py-2 border border-accent-one/20",
				props.className,
			)}
		/>
	),
	td: (props: ElementProps<"td">) => (
		<td
			{...props}
			className={clsx("px-3 py-2 border border-accent-one/10 align-top", props.className)}
		/>
	),
	img: ({ alt = "", ...props }: ElementProps<"img">) => (
		<img
			{...props}
			alt={alt}
			className={clsx("my-6 rounded-xl shadow-sm border border-accent-one/10", props.className)}
		/>
	),
};

export function mergeMDXComponents(overrides?: Partial<MDXComponentMap>): MDXComponentMap {
	return { ...mdxComponents, ...(overrides ?? {}) } as MDXComponentMap;
}
