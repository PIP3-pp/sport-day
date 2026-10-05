import type { Metadata } from "next";
import { GalleryLink } from "@/components/home/gallery-cta";
import { PageHeader } from "@/components/shared/section-heading";
import { getSiteConfig } from "@/lib/queries/config";

export const metadata: Metadata = { title: "Gallery" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const config = await getSiteConfig();
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="ภาพกิจกรรม"
        description="ภาพบรรยากาศและภาพการแข่งขันทั้งหมดรวบรวมไว้ใน Google Drive"
      />
      <div className="container-page py-8">
        <GalleryLink url={config.galleryDriveUrl} />
      </div>
    </>
  );
}
