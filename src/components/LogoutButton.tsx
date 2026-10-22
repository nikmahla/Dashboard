"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ui } from '@/lib/ui';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <button
      className={`glass px-3 py-2 ${ui.radius.md} text-sm`}
      onClick={async () => {
        await logout();
        router.push("/login");
        router.refresh();
      }}
    >
      Logout
    </button>
  );
}