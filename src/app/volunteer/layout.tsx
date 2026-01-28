import { Sidebar } from '@/components/layout/Sidebar';
import { PortalHeader } from '@/components/layout/PortalHeader';

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userType="volunteer" />
      <PortalHeader userType="volunteer" />

      {/* Main Content Area */}
      <main className="md:ml-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
