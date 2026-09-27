"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  User as UserIcon,
  LogOut,
  ChevronDown,
  Loader2,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";

interface UserButtonProps {
  dropUp?: boolean;
  fullWidth?: boolean;
  collapsed?: boolean;
}

export function UserButton({
  dropUp = false,
  fullWidth = false,
  collapsed = false,
}: UserButtonProps = {}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    if (collapsed) {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        </div>
      );
    }
    return (
      <div className={`flex h-9 ${fullWidth ? "w-full" : "w-24"} items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800`}>
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!session?.user) {
    if (collapsed) {
      return (
        <Link
          href="/sign-in"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          title="Sign In"
        >
          <LogIn className="h-4 w-4" />
        </Link>
      );
    }
    if (fullWidth) {
      return (
        <div className="flex items-center gap-2 w-full">
          <Link
            href="/sign-in"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Link>
          <Link
            href="/sign-up"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-teal-500 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up</span>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-teal-500 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Sign Up</span>
        </Link>
      </div>
    );
  }

  const user = session.user;
  const initials = (user.name || user.email || "U")
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (collapsed) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 text-xs font-semibold text-white shadow-sm ring-2 ring-white/80 hover:ring-teal-500/50 hover:scale-105 dark:ring-zinc-900 transition-all cursor-pointer"
          title={user.name || user.email}
          aria-label="User account"
        >
          {initials}
        </button>

        {isOpen && (
          <div
            className={`absolute ${
              dropUp
                ? "bottom-0 left-full ml-3 origin-bottom-left"
                : "top-0 left-full ml-3 origin-top-left"
            } w-64 rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100`}
          >
            <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user.name || "Authenticated User"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {user.email}
              </p>
            </div>

            <div className="py-1">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>Session active</span>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
              >
                {isSigningOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          fullWidth
            ? "flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white/80 p-2 text-left shadow-sm backdrop-blur transition-all hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800/80"
            : "flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-white/80 py-1 pl-1 pr-3 text-left shadow-sm backdrop-blur transition-all hover:bg-zinc-800/50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-850"
        }
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 text-xs font-semibold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <span
              className={`block truncate ${
                fullWidth
                  ? "text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                  : "max-w-[120px] text-xs font-medium text-zinc-800 dark:text-zinc-200"
              }`}
            >
              {user.name || user.email}
            </span>
            {fullWidth && user.name && (
              <span className="block truncate text-[10px] text-zinc-400 dark:text-zinc-500">
                {user.email}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform ${
            dropUp
              ? isOpen
                ? ""
                : "rotate-180"
              : isOpen
                ? "rotate-180"
                : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            dropUp
              ? "bottom-full mb-2 left-0 origin-bottom-left"
              : "right-0 mt-2 origin-top-right"
          } ${
            fullWidth ? "w-full min-w-[240px]" : "w-64"
          } rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 dark:shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100`}
        >
          <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name || "Authenticated User"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>Session active</span>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
