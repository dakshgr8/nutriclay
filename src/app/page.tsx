import { getDailySummary, getUserProfile } from '@/lib/db';
import { NutriClayDashboard } from '@/components/dashboard/NutriClayDashboard';

export const dynamic = 'force-dynamic';

export default function Page() {
  const today = new Date().toISOString().split('T')[0];
  const initialSummary = getDailySummary(today, 'user_clay_01');
  const initialProfile = getUserProfile('user_clay_01');

  return (
    <NutriClayDashboard
      initialSummary={initialSummary}
      initialProfile={initialProfile}
      initialDate={today}
    />
  );
}
