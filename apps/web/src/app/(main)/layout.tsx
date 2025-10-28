import AppProvider from "@/lib/providers/AppProvider";
import { MainLayoutContent } from "./MainLayoutContent";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </AppProvider>
  );
}
