"use client";

import { useLogoutMutation } from "@/features/auth/authApi";
import {
  useGetClassesQuery,
  useGetDepartmentsQuery,
  useGetStudentsQuery,
  useGetSubjectsQuery,
  useGetTeachersQuery,
} from "@/features/erp/erpApi";
import { useAppSelector } from "@/hooks/redux";
import {
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside search listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all lists using existing RTK queries, only when search is active/focused to save bandwidth
  const { data: students = [] } = useGetStudentsQuery(undefined, {
    skip: !isSearchFocused && !searchQuery,
  });
  const { data: teachers = [] } = useGetTeachersQuery(undefined, {
    skip: !isSearchFocused && !searchQuery,
  });
  const { data: classes = [] } = useGetClassesQuery(undefined, {
    skip: !isSearchFocused && !searchQuery,
  });
  const { data: subjects = [] } = useGetSubjectsQuery(undefined, {
    skip: !isSearchFocused && !searchQuery,
  });
  const { data: departments = [] } = useGetDepartmentsQuery(undefined, {
    skip: !isSearchFocused && !searchQuery,
  });

  // Filter search results client-side
  const searchResults = React.useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const query = debouncedQuery.toLowerCase();
    const results: {
      category: "Student" | "Teacher" | "Class" | "Subject" | "Department";
      title: string;
      subtitle: string;
      href: string;
    }[] = [];

    // Search Students
    students.forEach((s: any) => {
      const name = s.user?.name || "";
      const email = s.user?.email || "";
      const studentId = s.studentId || "";
      const roll = String(s.roll || "");
      if (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        studentId.toLowerCase().includes(query) ||
        roll.includes(query)
      ) {
        results.push({
          category: "Student",
          title: name,
          subtitle: `ID: ${studentId} | Roll: ${roll} | ${email}`,
          href: "/dashboard/students",
        });
      }
    });

    // Search Teachers
    teachers.forEach((t: any) => {
      const name = t.user?.name || "";
      const email = t.user?.email || "";
      const employeeId = t.employeeId || "";
      if (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        employeeId.toLowerCase().includes(query)
      ) {
        results.push({
          category: "Teacher",
          title: name,
          subtitle: `ID: ${employeeId} | ${email}`,
          href: "/dashboard/teachers",
        });
      }
    });

    // Search Classes
    classes.forEach((c: any) => {
      const name = c.name || "";
      const section = c.section || "";
      if (
        name.toLowerCase().includes(query) ||
        section.toLowerCase().includes(query)
      ) {
        results.push({
          category: "Class",
          title: `${name} (${section})`,
          subtitle: `Room: ${c.roomNo || "N/A"}`,
          href: "/dashboard/classes",
        });
      }
    });

    // Search Subjects
    subjects.forEach((sub: any) => {
      const name = sub.name || "";
      const code = sub.code || "";
      if (
        name.toLowerCase().includes(query) ||
        code.toLowerCase().includes(query)
      ) {
        results.push({
          category: "Subject",
          title: name,
          subtitle: `Code: ${code} | Class: ${sub.assignedClass?.name || "N/A"}`,
          href: "/dashboard/subjects",
        });
      }
    });

    // Search Departments
    departments.forEach((d: any) => {
      const name = d.name || "";
      const code = d.code || "";
      if (
        name.toLowerCase().includes(query) ||
        code.toLowerCase().includes(query)
      ) {
        results.push({
          category: "Department",
          title: name,
          subtitle: `Code: ${code}`,
          href: "/dashboard/departments",
        });
      }
    });

    return results.slice(0, 10);
  }, [debouncedQuery, students, teachers, classes, subjects, departments]);

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      // Navigate to the first result's page immediately
      router.push(searchResults[0].href);
      setIsSearchFocused(false);
    }
  };

  const handleResultClick = (href: string) => {
    router.push(href);
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  // Close sidebar on small screens initially
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully.");
      router.refresh();
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  const navigationItems: SidebarItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Classes", href: "/dashboard/classes", icon: Layers },
    { title: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
    { title: "Departments", href: "/dashboard/departments", icon: Building2 },
    { title: "Teachers", href: "/dashboard/teachers", icon: Users },
    { title: "Students", href: "/dashboard/students", icon: GraduationCap },
    {
      title: "Student Attendance",
      href: "/dashboard/attendance/students",
      icon: Calendar,
    },
    {
      title: "Teacher Attendance",
      href: "/dashboard/attendance/teachers",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-955 text-zinc-150 font-sans antialiased">
      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-900/60 bg-zinc-950 transition-all duration-200 ${
          isSidebarCollapsed ? "w-16" : "w-[260px]"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex h-16 items-center border-b border-zinc-900/60 transition-all duration-200 ${
            isSidebarCollapsed ? "justify-center px-0" : "px-4.5"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-650/10 border border-emerald-500/20 text-emerald-450 shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col select-none">
                <span className="font-extrabold text-[15px] tracking-tight text-zinc-100 leading-none">
                  EduManager
                </span>
                <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase mt-1 leading-none">
                  Students Management System
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          {navigationItems.map((item, itemIdx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={itemIdx}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-155 ${
                  isSidebarCollapsed ? "justify-center" : "space-x-3"
                } ${
                  isActive
                    ? "bg-emerald-655/10 text-emerald-455 border border-emerald-500/10 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-205 hover:bg-zinc-900/60"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-emerald-455" : "text-zinc-500"}`}
                />
                {!isSidebarCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* RIGHT SIDE LAYOUT CONTAINER */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          isSidebarCollapsed ? "pl-16" : "pl-[260px]"
        }`}
      >
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-zinc-900/60 bg-zinc-950/80 px-8 backdrop-blur-md">
          {/* Left tools */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div
              ref={searchContainerRef}
              className="relative hidden md:block w-80"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search students, teachers, classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-zinc-900/30 border border-zinc-900 rounded-xl text-zinc-150 placeholder-zinc-550 focus:outline-none focus:border-zinc-800 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 rounded-md hover:bg-zinc-800/40"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Floating search results overlay */}
              {isSearchFocused && searchQuery && (
                <div className="absolute left-0 right-0 mt-3 max-h-96 overflow-y-auto border border-zinc-800 bg-zinc-950 rounded-2xl p-2 shadow-2xl z-50 divide-y divide-zinc-900/60 scrollbar-thin scrollbar-thumb-zinc-900">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs font-semibold text-zinc-550">
                      No results found
                    </div>
                  ) : (
                    searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleResultClick(result.href)}
                        className="w-full text-left flex items-start gap-3 p-3 hover:bg-zinc-900/40 rounded-xl transition-all duration-150"
                      >
                        <div className="shrink-0">
                          <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-440 border border-emerald-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                            {result.category}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-200 truncate">
                            {result.title}
                          </p>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                            {result.subtitle}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 text-left border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/30 px-3.5 py-2 rounded-xl transition-all"
              >
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-440 font-bold text-xs uppercase shadow-sm">
                  {user?.name ? user.name[0] : "U"}
                </div>
                <div className="hidden lg:block text-xs">
                  <p className="font-semibold text-zinc-200 leading-none">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 capitalize">
                    {user?.role}
                  </p>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-48 z-50 border border-zinc-800 bg-zinc-955 rounded-xl p-1.5 shadow-2xl animate-fadeIn">
                    <div className="px-3 py-2 border-b border-zinc-900">
                      <p className="text-xs font-bold text-zinc-200">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-zinc-550 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-955/20 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT AREA CONTAINER */}
        <div className="flex-1 p-8 md:p-10 relative z-10 max-w-[1400px] w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
