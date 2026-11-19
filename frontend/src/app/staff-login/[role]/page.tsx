import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import { STAFF_ROLES, roleBySlug } from "@/lib/staff/roles";

type Props = { params: Promise<{ role: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => STAFF_ROLES.map((r) => ({ role: r.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const info = roleBySlug(role);
  return { title: info ? `${info.title} sign in` : "Staff sign in" };
}

export default async function StaffRoleLogin({ params }: Props) {
  const { role } = await params;
  const info = roleBySlug(role);
  if (!info) notFound();

  return (
    <AuthShell
      title={`${info.title} sign in`}
      subtitle={info.summary}
      panelTitle={info.panelTitle}
      panelText={info.panelText}
      footer={
        <>
          Not a {info.title.toLowerCase()}?{" "}
          <Link href="/staff-login" className="font-semibold text-spine-blue hover:text-blue-deep">
            Choose another role
          </Link>
        </>
      }
    >
      <StaffLoginForm role={info} />
    </AuthShell>
  );
}
