import { EventDetailSection } from '~/components/sections/EventDetailSection';

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  
  return (
    <main className="min-h-screen bg-gray-50">
      <EventDetailSection eventId={id} />
    </main>
  );
}