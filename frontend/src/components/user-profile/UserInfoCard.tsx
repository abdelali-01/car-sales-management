"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateAccount } from "@/store/auth/authHandler";
import { Admin, UpdateAdminDto } from "@/types/auto-sales";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useFormErrors } from "@/hooks/useFormErrors";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  KeyIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg?: string;
}

const InfoItem = ({ icon, label, value, iconBg = 'bg-gray-100 dark:bg-gray-800' }: InfoItemProps) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all duration-200 group">
    <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
        {value}
      </p>
    </div>
  </div>
);

export default function UserInfoCard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation('admin');

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { errors, setApiError, clearFieldError } = useFormErrors<Partial<UpdateAdminDto>>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear password mismatch error when typing
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }

    if (errors[name as keyof UpdateAdminDto]) {
      clearFieldError(name as keyof UpdateAdminDto);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
    setPasswordError('');
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match if password is provided
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError(t('profile.passwordMismatch'));
        return;
      }
      if (formData.password.length < 8) {
        setPasswordError(t('profile.passwordMinLength'));
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: UpdateAdminDto & { id: number } = {
        id: user!.id,
        name: formData.name,
        email: formData.email,
        role: user!.role, // Keep existing role
      };

      // Only include password if it's filled
      if (formData.password && formData.password.length >= 8) {
        payload.password = formData.password;
      }

      await dispatch(updateAccount(payload));
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      setApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.02] overflow-hidden">
        <div
          className="flex items-center justify-between p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
          onClick={() => setIsEditing(!isEditing)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile.personalInfo')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEditing ? t('profile.updateDetails') : t('profile.yourDetails')}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {isEditing ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* View Mode */}
        {!isEditing && (
          <div className="p-5 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                iconBg="bg-blue-50 dark:bg-blue-900/20"
                label={t('profile.username')}
                value={user.name}
              />
              <InfoItem
                icon={<EnvelopeIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                iconBg="bg-purple-50 dark:bg-purple-900/20"
                label={t('profile.emailAddress')}
                value={user.email || t('profile.notSet')}
              />
              <InfoItem
                icon={<ShieldCheckIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                iconBg="bg-amber-50 dark:bg-amber-900/20"
                label={t('profile.role')}
                value={`${user.role}`}
              />
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <form onSubmit={handleSave} className="p-5 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>{t('profile.username')}</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('profile.placeholders.username')}
                  required
                  error={!!errors.name}
                  hint={errors.name}
                />
              </div>
              <div>
                <Label>{t('profile.emailAddress')}</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('profile.placeholders.email')}
                  required
                  error={!!errors.email}
                  hint={errors.email}
                />
              </div>
              <div>
                <Label>{t('profile.role')}</Label>
                <Input
                  type="text"
                  value={`${user.role}`}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <span className="text-xs text-gray-400 mt-1">{t('profile.roleImmutable')}</span>
              </div>
            </div>

            {/* Password Section */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <KeyIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{t('profile.changePassword')}</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('profile.passwordHint')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>{t('profile.newPassword')}</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t('profile.placeholders.newPassword')}
                      error={!!passwordError}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>{t('profile.confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t('profile.placeholders.confirmPassword')}
                      error={!!passwordError}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.saving') : t('pixels.saveChanges')}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Security Section - Only show in view mode */}
      {!isEditing && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-3 p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <LockClosedIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile.security')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.securityDescription')}
              </p>
            </div>
          </div>

          <div className="p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                  <KeyIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t('profile.password')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('profile.securityPasswordHint')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm"
              >
                {t('profile.updateProfile')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
