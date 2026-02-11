"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Generate avatar color based on username
const getAvatarColor = (name: string) => {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from username
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || name.slice(0, 2).toUpperCase();
};

// Get role badge styling
const getRoleBadge = (role: string) => {
  const styles: Record<string, { bg: string; text: string; icon: string }> = {
    super: {
      bg: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: '👑'
    },
    admin: {
      bg: 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      icon: '🛡️'
    },
    moderator: {
      bg: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
      text: 'text-green-700 dark:text-green-400',
      icon: '✓'
    },
  };
  return styles[role?.toLowerCase()] || styles.admin;
};

export default function UserMetaCard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation('admin');

  if (!user) return null;

  const avatarColor = getAvatarColor(user.username);
  const initials = getInitials(user.username);
  const roleBadge = getRoleBadge(user?.role!);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 dark:from-brand-500/5 dark:to-purple-500/5" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative group">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg shadow-brand-500/20 ring-4 ring-white dark:ring-gray-800 transition-transform duration-300 group-hover:scale-105`}>
              <span className="text-3xl font-bold text-white tracking-wide">
                {initials}
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user.username}
            </h2>

            {/* Role Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${roleBadge.bg} ${roleBadge.text} text-sm font-medium mb-4`}>
              <span>{roleBadge.icon}</span>
              <span className="capitalize">{user.role} {t('profile.admin')}</span>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <UserCircleIcon className="w-4 h-4" />
                <span>{t('profile.activeAccount')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                <span>{t('profile.verified')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
