"use client";
import { Button } from "@/components/ui/button";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GradingIcon from "@mui/icons-material/Grading";
import SettingsIcon from "@mui/icons-material/Settings";
import { usePathname, useRouter } from "next/navigation";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const routes = [
  {
    label: "Dashboard",
    icon: <DashboardIcon className="h-4 w-4 mr-2" />,
    href: `/admin`,
  },
  {
    label: "Orders",
    icon: <GradingIcon className="h-4 w-4 mr-2" />,
    href: `/admin/orders`,
  },
  {
    label: "Products",
    icon: <ProductionQuantityLimitsIcon className="h-4 w-4 mr-2" />,
    href: `/admin/products`,
  },
  {
    label: "Manage Users",
    icon: <GroupIcon className="h-4 w-4 mr-2" />,
    href: `/admin/users`,
  },
  {
    label: "Manage Admins",
    icon: <AdminPanelSettingsIcon className="h-4 w-4 mr-2" />,
    href: `/admin/admins`,
  },
];

const NavItem = () => {
  const router = useRouter();
  const pathname = usePathname();

  const onClickHandler = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col flex-start">
      {routes.map((route) => (
        <Button
          onClick={() => onClickHandler(route.href)}
          key={route.href}
          size="sm"
          variant="ghost"
          className={`w-full text-white font-normal justify-start ${
            (pathname === route.href ||
              pathname.startsWith(`${route.href}/new`)) &&
            "bg-slate-600 text-sky-300"
          }`}
        >
          {route.icon}
          {route.label}
        </Button>
      ))}
    </div>
  );
};

export default NavItem;
