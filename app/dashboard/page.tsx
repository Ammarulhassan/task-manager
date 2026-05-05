import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/tasks/TaskList';

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <TaskList />
      </main>
    </div>
  );
}
