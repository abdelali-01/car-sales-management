"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn } from '../../store/auth/authHandler';
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import ButtonLoader from "../ui/load/ButtonLoader";

import { useTranslation } from "react-i18next";

export default function SignInForm() {
  const { t } = useTranslation('admin');
  const [showPassword, setShowPassword] = useState(false);
  const { isFetching } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();



  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(loggedIn(user, router))
  }



  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          {t('auth.backToHome')}
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t('auth.signInTitle')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('auth.signInSubtitle')}
            </p>
          </div>
          <div>
            <form onSubmit={submitHandler}>
              <div className="space-y-6">
                <div>
                  <Label>
                    {t('auth.email')} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="example@gmail.com" type="email" required value={user.email} onChange={changeHandler} name="email" />
                </div>
                <div>
                  <Label>
                    {t('auth.password')} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('auth.password')}
                      name="password"
                      required
                      value={user.password}
                      onChange={changeHandler}
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
                <div className="flex items-center justify-end">
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    {isFetching ? <ButtonLoader /> : t('auth.signInButton')}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                {t('auth.noAccount')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
