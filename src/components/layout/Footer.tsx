import { menuLinks, siteConfig } from "@/site.config";
import { url } from "@/utils/url";
import { Footer as SharedFooter } from "@semio-community/ecosystem-site-core";

export default function Footer() {
  return (
    <SharedFooter
      author={siteConfig.author}
      menuLinks={menuLinks}
      resolveHref={url}
    />
  );
}
