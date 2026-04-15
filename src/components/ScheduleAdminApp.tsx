/** @jsxImportSource react */
import type { Member } from "@/data/members";
import MemberAdminApp from "./MemberAdminApp";

interface ScheduleAdminAppProps {
  members: Member[];
}

export default function ScheduleAdminApp({ members }: ScheduleAdminAppProps) {
  return <MemberAdminApp initialMembers={members} defaultTab="schedules" />;
}
