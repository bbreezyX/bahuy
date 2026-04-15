/** @jsxImportSource react */
import { useEffect, useState } from "react";
import type { Member } from "@/data/members";
import { fetchMembers, subscribeToMembers } from "@/lib/member-api";
import AdminAuth from "./AdminAuth";
import MemberManagement from "./MemberManagement";
import ScheduleView from "./ScheduleView";

interface MemberAdminAppProps {
  initialMembers: Member[];
  defaultTab?: "members" | "schedules";
}

const tabs = [
  { id: "members", label: "Members" },
  { id: "schedules", label: "Schedules" },
] as const;

export default function MemberAdminApp({
  initialMembers,
  defaultTab = "members",
}: MemberAdminAppProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<"members" | "schedules">(defaultTab);

  useEffect(() => {
    fetchMembers()
      .then(fresh =>
        setMembers(prev =>
          fresh.map(f => {
            const cached = prev.find(m => m.nickname === f.nickname);
            return { ...f, skills: f.skills.length > 0 ? f.skills : (cached?.skills ?? []) };
          })
        )
      )
      .catch(() => {});

    const channel = subscribeToMembers(
      (newMember) => {
        setMembers((prev) => {
          if (prev.some((member) => member.nickname === newMember.nickname)) {
            return prev.map((member) =>
              member.nickname === newMember.nickname ? newMember : member
            );
          }

          return [...prev, newMember].sort((a, b) => a.nickname.localeCompare(b.nickname));
        });
      },
      (updatedMember) => {
        setMembers((prev) =>
          prev.map((member) =>
            member.nickname === updatedMember.nickname ? updatedMember : member
          )
        );
      },
      (deletedNickname) => {
        setMembers((prev) =>
          prev.filter((member) => member.nickname !== deletedNickname)
        );
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <AdminAuth title="CLAN ADMIN">
      <div className="mx-auto max-w-[1280px] px-4 pb-4 md:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <a
                href="/"
                className="mb-4 inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Home
              </a>
              <h1 className="font-display text-4xl leading-none tracking-wide text-white md:text-5xl">
                CLAN ADMIN
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/55 md:text-base">
                Manage the member roster and event schedule from one panel.
              </p>
            </div>

            <div className="inline-flex w-full rounded-full border border-white/10 bg-black/25 p-1 sm:w-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 rounded-full px-5 py-3 text-xs font-condensed font-semibold uppercase tracking-[0.2em] transition-colors sm:flex-none ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {activeTab === "members" ? (
        <MemberManagement initialMembers={members} />
      ) : (
        <ScheduleView members={members} isAdmin={true} />
      )}
    </AdminAuth>
  );
}
