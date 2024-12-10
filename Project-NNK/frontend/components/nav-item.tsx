"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/utils/authContext";

interface Route {
  label: string;
  href: string;
  role?: 'admin' | 'customer' | 'all';
}

const NavItem = () => { 
  const pathname = usePathname();
  const { user } = useAuth();

  const routes: Route[] = [
    {
      label: "Home",
      href: "/",
      role: "all"
    },
    {
      label: "Shop",
      href: "/shop",
      role: "all"
    },
    {
      label: "Orders",
      href: "/orders",
      role: "customer"
    },
    {
      label: "Dashboard",
      href: "/admin",
      role: "admin"
    }
  ];

  const filteredRoutes = routes.filter(route => {
    if (route.role === "all") return true;
    if (!user) return false;
    if (route.role === user.role) return true;
    return false;
  });

  return (
    <div className="flex items-center gap-2 mx-2 max-md:flex-col max-md:items-start max-md:mt-3">
      {filteredRoutes.map((route) => (
        <Link 
          key={route.href} 
          href={route.href} 
          className={`p-2 max-md:p-0 transition-colors duration-200
            ${pathname === route.href || pathname.startsWith(`${route.href}/`) 
              ? "text-primary font-semibold max-md:underline" 
              : "text-gray-600 hover:text-gray-900"}`}
        >
          <span className="max-md:text-yellow-50 font-serif text-l max-md:text-xl">
            {route.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default NavItem;
