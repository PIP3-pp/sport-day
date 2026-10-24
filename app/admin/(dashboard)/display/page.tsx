import { AdminPageHeader, Panel } from "@/components/admin/admin-page";
import { BannerUploader } from "@/components/admin/banner-uploader";
import { VisibilitySwitches } from "@/components/admin/visibility-switches";
import { fetchSiteConfig } from "@/lib/queries/config";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminDisplayPage() {
  await requireAdmin();
  const config = await fetchSiteConfig();

  return (
    <>
      <AdminPageHeader
        title="หน้าเว็บ"
        description="เปลี่ยนรูปปก และเลือกว่าจะเปิดหรือปิดส่วนไหนของหน้าเว็บ"
      />
      <div className="grid max-w-2xl gap-6">
        <Panel title="รูปปก" className="pb-4">
          <div className="px-4 pt-4 sm:px-6">
            <BannerUploader currentUrl={config.bannerUrl} />
          </div>
        </Panel>
        <Panel title="การแสดงผล">
          <VisibilitySwitches visibility={config.visibility} />
        </Panel>
      </div>
    </>
  );
}
