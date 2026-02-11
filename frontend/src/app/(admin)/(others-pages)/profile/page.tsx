"use client";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation('admin');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {t('profile.description')}
        </p>
      </div>

      {/* Profile Content */}
      <div className="space-y-6">
        <UserMetaCard />
        <UserInfoCard />
      </div>
    </div>
  );
}
