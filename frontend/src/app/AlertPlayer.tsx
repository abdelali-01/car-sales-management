'use client';

import Alert from "@/components/ui/alert/Alert";
import { setSuccessAlert } from "@/store/alert/alertSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AlertPlayer() {
    const { successAlert } = useSelector((state: RootState) => state.alert);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=>{
        let player;
        if(successAlert){
            player = setTimeout(() => {
                dispatch(setSuccessAlert(null));
            }, 3000);
        }

        return () => {
            if (player) {
                clearTimeout(player);
            }
        }
    },[successAlert])
    
    return (
        <>
            {successAlert && <Alert variant="success" title={successAlert}/>}
        </>
    )
}
