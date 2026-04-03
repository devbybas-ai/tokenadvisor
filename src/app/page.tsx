import { WebSiteJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function Home() {
  return (
    <>
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />
      <DashboardShell />
    </>
  );
}
