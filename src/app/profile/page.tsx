import { Header } from '~/components/layout/Header';
import { ProfileSection } from '~/components/sections/ProfileSection';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <ProfileSection />
    </main>
  );
}