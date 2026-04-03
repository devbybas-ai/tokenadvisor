import { BUSINESS, SITE_URL } from "@/lib/seo";

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS.name,
    url: SITE_URL,
    description: BUSINESS.description,
    creator: {
      "@type": "Organization",
      name: BUSINESS.owner,
      url: BUSINESS.ownerUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BUSINESS.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: BUSINESS.description,
    creator: {
      "@type": "Organization",
      name: BUSINESS.owner,
      url: BUSINESS.ownerUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
