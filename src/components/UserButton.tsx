'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { KeyRound, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logout } from "@/actions/logout";
import Link from "next/link";

const UserButton = () => {
  const user = useCurrentUser();

  const handleLogout = () => {
    logout().then((res) => console.log(res));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="bg-red-200">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user?.allowChangePassword && (
          <Link href="/change-password">
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex gap-2 items-center">
                <KeyRound className="h-4 w-4" />
                Change Password
              </div>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <div className="flex gap-2 items-center" >
            <LogOut className="h-4 w-4" /> 
            Logout
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton;