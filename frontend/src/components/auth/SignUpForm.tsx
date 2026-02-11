"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import React, { useState } from "react";
import Select from "../form/Select";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { registerUser } from "@/store/auth/authHandler";
import { useFormErrors } from "@/hooks/useFormErrors";

export interface User {
  id?: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  role?: string
}

const userState = {
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: ''
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<User>(userState);
  const { errors, setFieldError, clearFieldError, clearErrors, setApiError } = useFormErrors<Partial<User>>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof User]) {
      clearFieldError(name as keyof User);
    }
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!user.username.trim()) {
      setFieldError('username', 'Admin name is required');
      isValid = false;
    }

    if (!user.email.trim()) {
      setFieldError('email', 'Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      setFieldError('email', 'Please enter a valid email');
      isValid = false;
    }

    if (!user.password) {
      setFieldError('password', 'Password is required');
      isValid = false;
    } else if (user.password.length < 8) {
      setFieldError('password', 'Password must be at least 8 characters');
      isValid = false;
    }

    if (!user.confirmPassword) {
      setFieldError('confirmPassword', 'Please confirm your password');
      isValid = false;
    } else if (user.password !== user.confirmPassword) {
      setFieldError('confirmPassword', 'Passwords do not match');
      isValid = false;
    }

    if (!user.role) {
      setFieldError('role', 'Please select a role');
      isValid = false;
    }

    return isValid;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await dispatch(registerUser(user, () => setUser(userState)));
    } catch (error) {
      setApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full lg:max-w-3/4 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Register your admin
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the information below to register your admin!
            </p>
          </div>
          <div>
            <form onSubmit={submitHandler}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Admin Name */}
                  <div className="sm:col-span-2">
                    <Label>
                      Admin Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your admin name"
                      required
                      value={user.username}
                      onChange={handleChange}
                      error={!!errors.username}
                      hint={errors.username}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="sm:col-span-1">
                    <Label>
                      Phone number
                    </Label>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Enter your admin phone"
                      value={user.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      hint={errors.phone}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your admin email"
                      required
                      value={user.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      hint={errors.email}
                    />
                  </div>

                  {/* Password Section */}
                  <div className="sm:col-span-1">
                    <Label>
                      Password<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your admin password"
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

                  <div className="sm:col-span-1">
                    <Label>
                      Confirm Password<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Confirm your password"
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
                    <Label>Role <span className="text-error-500">*</span></Label>
                    <Select
                      options={[
                        { value: 'super', label: 'Super admin' },
                        { value: 'sub-super', label: 'Admin' },
                        { value: 'manager', label: 'Order manager' },
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

                {/* Submit Button */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Register Admin'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
