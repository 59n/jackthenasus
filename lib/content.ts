import site from "@/content/site.json";

export type SiteContent = {
  identity: {
    name: string;
    title: string;
    tagline: string;
  };
  hero: {
    summary: string;
    availability: string;
    primaryAction?: {
      label: string;
      href: string;
    };
    secondaryAction?: {
      label: string;
      href: string;
    };
    metrics: Array<{
      label: string;
      value: string;
    }>;
  };
  sections: Array<{
    heading: string;
    body: string;
  }>;
  highlights: Array<{
    title: string;
    description: string;
    meta: string;
  }>;
  contact: {
    note: string;
    email: string;
    socials: Array<{
      label: string;
      href: string;
    }>;
  };
};

export function getSiteContent(): SiteContent {
  return site as SiteContent;
}
