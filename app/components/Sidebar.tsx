"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      mainContent.style.marginLeft = isCollapsed ? "80px" : "256px";
      mainContent.style.transition = "margin-left 300ms ease-in-out";
    }
  }, [isCollapsed]);

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col shadow-xl fixed left-0 top-0 transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`p-4 border-b border-gray-700/50 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Painting Generator
              </h1>
              <p className="text-gray-400 text-xs">Painting App</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-white ${
            isCollapsed ? "" : "ml-auto"
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/") && pathname === "/"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Home" : ""}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>🏠</span>
              {!isCollapsed && <span className="font-medium">Home</span>}
            </Link>
          </li>

          <li>
            {!isCollapsed && (
              <div className="px-4 py-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Paintings
              </div>
            )}
            <Link
              href="/paintings/generate"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/paintings/generate")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Generate Painting" : ""}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>🎨</span>
              {!isCollapsed && (
                <span className="font-medium">Generate Painting</span>
              )}
            </Link>
            <Link
              href="/paintings/table"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/paintings/table")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Paintings Table" : ""}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>📊</span>
              {!isCollapsed && <span className="font-medium">Paintings Table</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/call-logs"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/call-logs")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Call Logs" : ""}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>📞</span>
              {!isCollapsed && <span className="font-medium">Call Logs</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/state-data"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/state-data")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "State Data" : ""}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>🗺️</span>
              {!isCollapsed && <span className="font-medium">State Data</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/settings"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive("/settings")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Settings" : ""}
            >
              <span className={`text-lg ${isCollapsed ? "" : "mr-3"}`}>⚙️</span>
              {!isCollapsed && <span className="font-medium">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Avatar Login in Footer */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/50">
        <div
          className={`flex items-center p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
            U
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
