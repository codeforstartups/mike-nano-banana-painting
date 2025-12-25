"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Palette,
  Table,
  Phone,
  MapPin,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Update main content margin when sidebar collapses
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.style.marginLeft = isCollapsed ? "80px" : "260px";
      mainContent.style.transition = "margin-left 300ms ease-in-out";
    }
  }, [isCollapsed]);

  const menuItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      title: "Home",
    },
    {
      href: "/paintings/generate",
      icon: Palette,
      label: "Generate Painting",
      title: "Generate Painting",
    },
    {
      href: "/paintings/table",
      icon: Table,
      label: "Paintings Table",
      title: "Paintings Table",
    },
    {
      href: "/call-logs",
      icon: Phone,
      label: "Call Logs",
      title: "Call Logs",
    },
    {
      href: "/state-data",
      icon: MapPin,
      label: "State Data",
      title: "State Data",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      title: "Settings",
    },
  ];

  return (
    <div
      className={`bg-[#171717] text-white h-screen flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 justify-center">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <span className="text-sm font-medium">M</span>
            </div>
            <div>
              <h1 className="text-sm font-medium text-white">Painting Generator</h1>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <ul className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-md transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.title : ""}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && (
                    <span className="text-sm font-normal">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - User */}
      <div className="h-16 border-t border-white/5 px-3">
        <div
          className={`flex items-center h-full ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium">U</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-white truncate">User</p>
              <p className="text-xs text-white/50 truncate">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
