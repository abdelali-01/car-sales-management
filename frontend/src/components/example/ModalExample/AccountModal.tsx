'use client';

import { User } from '@/components/auth/SignUpForm'
import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button'
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { updateAccount } from '@/store/auth/authHandler';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormErrors } from '@/hooks/useFormErrors';

interface Props {
    account: User;
    closeModal: () => void;
}

export default function AccountModal({ account, closeModal }: Props) {
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const [passwordDisplay, setPasswordDisplay] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>()
    const { errors, setApiError, clearFieldError } = useFormErrors<Partial<User>>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [userInfo, setUserInfo] = useState<User>(account);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof User]) {
            clearFieldError(name as keyof User);
        }
    }


    useEffect(() => {
        setUserInfo((prev) => ({ ...prev, password: '' }));

        if (user && user.id == account.id) {
            setIsDisabled(false);
            setPasswordDisplay(true)
        } else {
            setIsDisabled(true)
            setPasswordDisplay(false);
        };
    }, [user, account]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            let payload = { ...userInfo };

            if (!isChecked) {
                delete payload.password;
            }

            console.log('payload', payload);

            await dispatch(updateAccount(payload));
            closeModal();
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <form className="" onSubmit={handleSave}>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                Account Information
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="col-span-1">
                    <Label>Username</Label>
                    <Input
                        type="text"
                        name='username'
                        placeholder="Username"
                        value={userInfo.username}
                        required
                        onChange={changeHandler}
                        disabled={isDisabled}
                        error={!!errors.username}
                        hint={errors.username}
                    />
                </div>

                <div className="col-span-1">
                    <Label>Phone</Label>
                    <Input
                        type="text"
                        name='phone'
                        onChange={changeHandler}
                        placeholder="phone number"
                        value={userInfo.phone}
                        disabled={isDisabled}
                        error={!!errors.phone}
                        hint={errors.phone}
                    />
                </div>

                <div className="col-span-1">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        name='email'
                        onChange={changeHandler}
                        placeholder="example@gmail.com"
                        value={userInfo.email}
                        disabled={isDisabled}
                        required
                        error={!!errors.email}
                        hint={errors.email}
                    />
                </div>

                <div className="col-span-1">
                    <Label>Role</Label>
                    <Select options={[
                        { value: 'super', label: 'Super admin' },
                        { value: 'sub-super', label: 'admin' },
                        { value: 'manager', label: 'Order Manager' },
                    ]}
                        defaultValue={userInfo.role}
                        onChange={(value) => {
                            setUserInfo(prev => ({ ...prev, role: value }));
                            if (errors.role) clearFieldError('role');
                        }}
                        required={true}
                        disabled={user?.role !== 'super' || (user.role === 'super' && user.id == account.id)}
                        className={errors.role ? 'border-error-500' : ''}
                    />
                    {errors.role && <p className="mt-1 text-sm text-error-500">{errors.role}</p>}
                </div>
                {passwordDisplay &&
                    <>
                        <div className="col-span-2">
                            <Label>Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    value={userInfo.password}
                                    onChange={changeHandler}
                                    minLength={8}
                                    required={isChecked}
                                    disabled={!isChecked}
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
                        <div className='col-span-2'>
                            <Checkbox
                                label='I want to update my password'
                                checked={isChecked}
                                onChange={(checked) => setIsChecked(checked)}
                            />
                        </div>
                    </>
                }
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
                <Button size="sm" variant="outline" onClick={closeModal} disabled={isSubmitting} type="button">
                    Close
                </Button>
                <Button size="sm" disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
