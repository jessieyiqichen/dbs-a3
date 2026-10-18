import { TodayScreen } from "@/components/today/TodayScreen";
import { AppShell } from "@/components/ui/AppShell";

export default function Home() {
  return (
    <AppShell wide>
      <TodayScreen />
    </AppShell>
  );
}
