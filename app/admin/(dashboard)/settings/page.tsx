import { AdminPageHeader, Panel } from "@/components/admin/admin-page";
import { SettingsForm } from "@/components/admin/settings-form";
import { saveSettings } from "@/lib/actions/settings";
import { fetchSiteConfig } from "@/lib/queries/config";

export default async function AdminSettingsPage() {
  const config = await fetchSiteConfig();

  return (
    <>
      <AdminPageHeader title="Settings" description="ข้อมูลงานที่แสดงทั่วทั้งเว็บไซต์" />
      <Panel className="max-w-2xl p-4 sm:p-6">
        <SettingsForm config={config} action={saveSettings} />
      </Panel>
    </>
  );
}
