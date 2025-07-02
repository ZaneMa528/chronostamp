import { Header } from "~/components/layout/Header";
import { CreateEventSection } from "~/components/sections/CreateEventSection";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <CreateEventSection />
    </main>
  );
}