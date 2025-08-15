import { UserSettings } from "@/components/settings/user-settings";
import { getSession } from "@/lib/get-session";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">
          Gerencie suas preferências e informações da conta
        </p>
      </div>

      <UserSettings user={session!.user} />
    </div>
  );
}
