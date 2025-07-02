import { Header } from "~/components/layout/Header";
import { EventDetailSection } from "~/components/sections/EventDetailSection";

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <main className="bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <EventDetailSection eventId={id} />
    </main>
  );
}
