/** The five staff roles. `role` matches the backend key; `slug` is the URL used for that role's sign-in page. */
export interface StaffRoleInfo {
  role: string;
  slug: string;
  title: string;
  summary: string;
  panelTitle: string;
  panelText: string;
}

export const STAFF_ROLES: StaffRoleInfo[] = [
  {
    role: "super_admin",
    slug: "admin",
    title: "Super admin",
    summary: "Platform owner. Manage users, staff, courses, settings and the audit log.",
    panelTitle: "Run the academy.",
    panelText: "Every action you take here is recorded in the audit log.",
  },
  {
    role: "instructor",
    slug: "instructor",
    title: "Instructor",
    summary: "Create and manage your courses, quizzes and learners.",
    panelTitle: "Teach the next generation.",
    panelText: "Build courses, see how learners are doing and answer their questions.",
  },
  {
    role: "reviewer",
    slug: "reviewer",
    title: "Content reviewer",
    summary: "Check new and updated courses before they go live.",
    panelTitle: "Keep quality high.",
    panelText: "Review courses against the standards and send clear feedback to instructors.",
  },
  {
    role: "moderator",
    slug: "moderator",
    title: "Community moderator",
    summary: "Keep discussions helpful and respectful.",
    panelTitle: "Keep the community kind.",
    panelText: "Handle flagged posts and reports, and keep a record of every decision.",
  },
  {
    role: "support",
    slug: "support",
    title: "Support agent",
    summary: "Help learners with accounts, access and certificates.",
    panelTitle: "Help learners get unstuck.",
    panelText: "Answer tickets quickly and fix access problems for learners.",
  },
];

export const roleBySlug = (slug: string) => STAFF_ROLES.find((r) => r.slug === slug);
export const roleByKey = (role: string) => STAFF_ROLES.find((r) => r.role === role);
