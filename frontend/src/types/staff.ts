export interface NavSection { key: string; label: string; items: string[] }
export interface Kpi { key: string; label: string; value: number | null }
export interface TodayItem { label: string; count: number }
export interface StaffDashboard {
  role: string;
  role_title: string;
  user: { name: string; email: string };
  session: { last_login: string | null };
  kpis: Kpi[];
  today: TodayItem[];
  sections: NavSection[];
}
