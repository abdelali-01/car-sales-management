'use client';

import ErrorModal from "@/components/example/ModalExample/ErrorModal";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { removeError } from "@/store/error/errorSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ErrorChecking() {
    const { error } = useSelector((state: RootState) => state.error);
    const dispatch = useDispatch<AppDispatch>();

    const modal = useModal(
        true,
        () => dispatch(removeError())
    );

    useEffect(() => {
        if (error) modal.openModal();
    }, [error, modal]);

    return (
        <>
            {error &&
                <Modal onClose={modal.closeModal} isOpen={modal.isOpen}
                    className="max-w-[600px] p-5 lg:p-10" index="z-999999">
                    <ErrorModal errorDetails={error} closeModal={modal.closeModal} />
                </Modal>}
        </>
    )
}
