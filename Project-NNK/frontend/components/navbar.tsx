"use client";

import Container from "./ui/container";
import Logo from "./Logo";
import NavbarActions from "./navbar-actions";
import { Button } from "./ui/button";
import NavbarSearch from "./navbar-search";
import MobileSidebar from "@/app/(admin)/components/mobile-sidebar";
import NavItem from "./nav-item";
import { useAuth } from "@/app/utils/authContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/customer-sign-in");
  };

  return (
    <div className="border-b">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <MobileSidebar>
            <NavbarSearch />
            <NavItem />
          </MobileSidebar>
          <div className="flex items-center max-md:hidden">
            <Logo />
            <NavItem />
          </div>
          <div className="max-md:hidden">
            <NavbarSearch />
          </div>
          <div className="flex items-center">
            <NavbarActions />
            {user ? (
              <div className="relative">
                <div
                  className="rounded-full overflow-hidden cursor-pointer"
                  style={{ height: 35, width: 35 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={"/default-avatar.png"}
                    alt={user.name || "User Avatar"}
                    className="object-cover w-full h-full"
                    style={{ borderRadius: "50%" }}
                  />
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => router.push("/user-orders")}
                    >
                      My Orders
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button className="rounded-sm" asChild>
                  <Link href="/customer-sign-up">Sign up</Link>
                </Button>
                <Button className="rounded-sm" asChild>
                  <Link href="/customer-sign-in">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
