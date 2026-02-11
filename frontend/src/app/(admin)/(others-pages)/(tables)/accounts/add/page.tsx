'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { AppDispatch } from '@/store/store';
import { registerUser } from '@/store/auth/authHandler';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';

export interface User {
    id?: string;
    username: string;
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    createdAt?: string;
}

const initialState: User = {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
};

export default function AddAccountPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [user, setUser] = useState<User>(initialState);
    const { errors, setFieldError, clearFieldError, clearErrors, setApiError } = useFormErrors<Partial<User>>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation('admin');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof User]) {
            clearFieldError(name as keyof User);
        }
    };

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!user.username.trim()) {
            setFieldError('username', t('admins.validation.usernameRequired'));
            isValid = false;
        }

        if (!user.email.trim()) {
            setFieldError('email', t('admins.validation.emailRequired'));
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            setFieldError('email', t('admins.validation.emailInvalid'));
            isValid = false;
        }

        if (!user.password) {
            setFieldError('password', t('admins.validation.passwordRequired'));
            isValid = false;
        } else if (user.password.length < 8) {
            setFieldError('password', t('admins.validation.passwordLength'));
            isValid = false;
        }

        if (!user.confirmPassword) {
            setFieldError('confirmPassword', t('admins.validation.confirmPasswordRequired'));
            isValid = false;
        } else if (user.password !== user.confirmPassword) {
            setFieldError('confirmPassword', t('admins.validation.passwordMismatch'));
            isValid = false;
        }

        if (!user.role) {
            setFieldError('role', t('admins.validation.roleRequired'));
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await dispatch(registerUser(user, () => {
                router.push('/accounts');
            }));
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/accounts');
    };

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['accounts']} pageTitle={t('admins.addTitle')} />

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('admins.registerTitle')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {t('admins.registerDescription')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Admin Name */}
                        <div className="sm:col-span-2">
                            <Label>
                                {t('admins.form.username')}<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                placeholder={t('admins.form.usernamePlaceholder')}
                                required
                                value={user.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                hint={errors.username}
                            />
                        </div>

                        {/* Phone */}
                        <div className="sm:col-span-1">
                            <Label>{t('admins.form.phone')}</Label>
                            <Input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder={t('admins.form.phonePlaceholder')}
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-1">
                            <Label>
                                {t('admins.form.email')}<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                placeholder={t('admins.form.emailPlaceholder')}
                                required
                                value={user.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                hint={errors.email}
                            />
                        </div>

                        {/* Password */}
                        <div className="sm:col-span-1">
                            <Label>
                                {t('admins.form.password')}<span className="text-error-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    placeholder={t('admins.form.passwordPlaceholder')}
                                    type={showPassword ? "text" : "password"}
                                    required
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    error={!!errors.password}
                                    hint={errors.password}
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

                        {/* Confirm Password */}
                        <div className="sm:col-span-1">
                            <Label>
                                {t('admins.form.confirmPassword')}<span className="text-error-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    placeholder={t('admins.form.confirmPasswordPlaceholder')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    minLength={8}
                                    error={!!errors.confirmPassword}
                                    hint={errors.confirmPassword}
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

                        {/* Role Selection */}
                        <div className="sm:col-span-2">
                            <Label>{t('admins.form.role')} <span className="text-error-500">*</span></Label>
                            <Select
                                options={[
                                    { value: 'super', label: t('admins.roles.super') },
                                    { value: 'sub_super', label: t('admins.roles.sub_super') },
                                    { value: 'manager', label: t('admins.roles.manager') },
                                ]}
                                onChange={(value) => {
                                    setUser(prev => ({ ...prev, role: value }));
                                    if (errors.role) {
                                        clearFieldError('role');
                                    }
                                }}
                                required={true}
                                className={errors.role ? 'border-error-500' : ''}
                            />
                            {errors.role && (
                                <p className="mt-1 text-sm text-error-500">{errors.role}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('common.creating') : t('admins.create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
