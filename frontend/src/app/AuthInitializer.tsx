'use client';

import { checkIfLoggedIn } from "@/store/auth/authHandler";
import { AppDispatch } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthInitializer() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(()=>{
        dispatch(checkIfLoggedIn(pathname , router));
    },[dispatch]);
    
    return null
}
