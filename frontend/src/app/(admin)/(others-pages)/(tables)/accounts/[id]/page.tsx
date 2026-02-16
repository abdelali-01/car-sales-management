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
import { fetchAdmins } from '@/store/admins/adminsHandler';
import { Admin, UpdateAdminDto } from '@/types/auto-sales';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';

export default function EditAccountPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const accountId = params?.id ? Number(params.id) : null;
    const { errors, setApiError, clearFieldError } = useFormErrors<Partial<UpdateAdminDto>>();

    const { admins, isFetching } = useSelector((state: RootState) => state.admins);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [wantToUpdatePassword, setWantToUpdatePassword] = useState(false);
    const [account, setAccount] = useState<UpdateAdminDto & { id: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation('admin');

    // Fetch admins if not loaded
    useEffect(() => {
        if (admins.length === 0 && !isFetching) {
            dispatch(fetchAdmins());
        }
    }, [dispatch, admins.length, isFetching]);

    // Load account data
    useEffect(() => {
        if (accountId && admins.length > 0) {
            const existingAccount = admins.find((a: Admin) => a.id === accountId);
            if (existingAccount) {
                setAccount({
                    id: existingAccount.id,
                    name: existingAccount.name,
                    email: existingAccount.email,
                    role: existingAccount.role,
                    // Password fields are not pre-filled
                });
            }
        }
    }, [accountId, admins]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccount(prev => prev ? { ...prev, [name]: value } : null);
        if (errors[name as keyof UpdateAdminDto]) {
            clearFieldError(name as keyof UpdateAdminDto);
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
                delete payload.confirmPassword;
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
    const isOwnAccount = currentUser?.id === accountId;
    const isSuperAdmin = currentUser?.role === 'super_admin';
    const canEditFields = isOwnAccount || isSuperAdmin;
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
                            : t('admins.editDescription', { name: account.name })}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Name */}
                        <div className="sm:col-span-2">
                            <Label>{t('admins.form.name')}</Label>
                            <Input
                                type="text"
                                name="name"
                                placeholder={t('admins.form.namePlaceholder')}
                                value={account.name}
                                onChange={handleChange}
                                disabled={!canEditFields}
                                required
                                error={!!errors.name}
                                hint={errors.name}
                            />
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
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
                        <div className="sm:col-span-2">
                            <Label>{t('admins.form.role')}</Label>
                            <Select
                                options={[
                                    { value: 'admin', label: t('admins.roles.admin') },
                                    { value: 'super_admin', label: t('admins.roles.super_admin') },
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
