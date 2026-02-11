'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/form/input/Checkbox';
import Loader from '@/components/ui/load/Loader';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { AppDispatch, RootState } from '@/store/store';
import { updateAccount } from '@/store/auth/authHandler';
import { fetchAccounts } from '@/store/accounts/accountHandler';
import { User } from '../add/page';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';

export default function EditAccountPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const accountId = params?.id ? String(params.id) : null;
    const { errors, setApiError, clearFieldError } = useFormErrors<Partial<User>>();

    const { accounts } = useSelector((state: RootState) => state.accounts);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [wantToUpdatePassword, setWantToUpdatePassword] = useState(false);
    const [account, setAccount] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const { t } = useTranslation('admin');

    // Fetch accounts if not loaded
    useEffect(() => {
        if (!accounts) {
            dispatch(fetchAccounts());
        }
    }, [dispatch, accounts]);

    // Load account data
    useEffect(() => {
        if (accountId && accounts && !accountLoaded) {
            const existingAccount = accounts.find((a: User) => a.id == accountId);
            if (existingAccount) {
                setAccount({
                    ...existingAccount,
                    password: ''
                });
                setAccountLoaded(true);
            }
        }
    }, [accountId, accounts, accountLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccount(prev => prev ? { ...prev, [name]: value } : null);
        if (errors[name as keyof User]) {
            clearFieldError(name as keyof User);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account) return;

        setIsSubmitting(true);
        try {
            const payload = { ...account };
            if (!wantToUpdatePassword) {
                delete payload.password;
            }

            await dispatch(updateAccount(payload));
            router.push('/accounts');
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/accounts');
    };

    // Check if current user can edit this account
    const isOwnAccount = currentUser?.id == accountId;
    const isSuperAdmin = currentUser?.role === 'super';
    const canEditFields = isOwnAccount;
    const canEditRole = isSuperAdmin && !isOwnAccount;

    if (!account) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['accounts']} pageTitle={t('admins.editTitle')} />

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('admins.editTitle')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {isOwnAccount
                            ? t('admins.editOwnDescription')
                            : t('admins.editDescription', { username: account.username })}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Username */}
                        <div className="sm:col-span-1">
                            <Label>{t('admins.form.username')}</Label>
                            <Input
                                type="text"
                                name="username"
                                placeholder={t('admins.form.usernamePlaceholder')}
                                value={account.username}
                                onChange={handleChange}
                                disabled={!canEditFields}
                                required
                                error={!!errors.username}
                                hint={errors.username}
                            />
                        </div>

                        {/* Phone */}
                        <div className="sm:col-span-1">
                            <Label>{t('admins.form.phone')}</Label>
                            <Input
                                type="text"
                                name="phone"
                                placeholder={t('admins.form.phonePlaceholder')}
                                value={account.phone || ''}
                                onChange={handleChange}
                                disabled={!canEditFields}
                                error={!!errors.phone}
                                hint={errors.phone}
                            />
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-1">
                            <Label>{t('admins.form.email')}</Label>
                            <Input
                                type="email"
                                name="email"
                                placeholder={t('admins.form.emailPlaceholder')}
                                value={account.email}
                                onChange={handleChange}
                                disabled={!canEditFields}
                                required
                                error={!!errors.email}
                                hint={errors.email}
                            />
                        </div>

                        {/* Role */}
                        <div className="sm:col-span-1">
                            <Label>{t('admins.form.role')}</Label>
                            <Select
                                options={[
                                    { value: 'super', label: t('admins.roles.super') },
                                    { value: 'sub_super', label: t('admins.roles.sub_super') },
                                    { value: 'manager', label: t('admins.roles.manager') },
                                ]}
                                defaultValue={account.role}
                                onChange={(value) => setAccount(prev => prev ? { ...prev, role: value } : null)}
                                disabled={!canEditRole}
                                required={true}
                            />
                            {!canEditRole && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {isOwnAccount
                                        ? t('admins.errors.ownRole')
                                        : t('admins.errors.superAdminRole')}
                                </p>
                            )}
                        </div>

                        {/* Password Section - Only for own account */}
                        {isOwnAccount && (
                            <>
                                <div className="sm:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Checkbox
                                        label={t('admins.updatePasswordCheckbox')}
                                        checked={wantToUpdatePassword}
                                        onChange={(checked) => setWantToUpdatePassword(checked)}
                                    />
                                </div>

                                {wantToUpdatePassword && (
                                    <div className="sm:col-span-2">
                                        <Label>{t('admins.form.password')}</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder={t('admins.form.passwordPlaceholder')}
                                                name="password"
                                                value={account.password || ''}
                                                onChange={handleChange}
                                                minLength={8}
                                                required={wantToUpdatePassword}
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
                                        <p className="mt-1 text-xs text-gray-500">
                                            {t('admins.validation.passwordLength')}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
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
                            {isSubmitting ? t('common.saving') : t('common.saveChanges')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
