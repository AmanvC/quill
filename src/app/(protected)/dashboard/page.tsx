'use client';

import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { signOut } from "next-auth/react";

const DashboardPage = () => {
  const user = useCurrentUser();

  return (
    <div>
      {JSON.stringify(user)}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

export default DashboardPage;