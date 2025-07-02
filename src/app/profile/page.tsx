import { Header } from '~/components/layout/Header';
import { ProfileSection } from '~/components/sections/ProfileSection';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <ProfileSection />
    </main>
  );
}