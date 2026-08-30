"use client";

import Image from "next/image";
import checkIcon from "@svg/check.svg";
import xIcon from "@svg/x.svg";
import AppModal from "@/Components/Modal/AppModal/AppModal";
import ModalButton from "@/Components/Modal/ModalButton/ModalButton";

// success / error message after save, delete, etc.
interface StatusModalProps {
  id: string;
  variant: "success" | "failed";
  title: string;
  message: string;
  buttonLabel?: string;
}

export default function StatusModal({
  id,
  variant,
  title,
  message,
  buttonLabel = "Continue",
}: StatusModalProps) {
  const isSuccess = variant === "success";

  return (
    <AppModal
      id={id}
      footer={
        <form method="dialog">
          <ModalButton type="submit" tone={isSuccess ? "primary" : "danger"}>
            {buttonLabel}
          </ModalButton>
        </form>
      }
    >
      <div className="flex flex-col items-center px-2 pt-2 pb-1 text-center">
        <span
          className={`mb-4 flex size-16 items-center justify-center rounded-full ${
            isSuccess ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}
        >
          {isSuccess ? (
            <Image
              src={checkIcon}
              alt="Confirm"
              width={32}
              height={32}
              className="size-8"
            />
          ) : (
            <Image
              src={xIcon}
              alt="Close"
              width={32}
              height={32}
              className="size-8"
            />
          )}
        </span>
        <h2 className="font-serif text-xl font-bold">{title}</h2>
        <p className="text-base-content/60 mt-2 text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </AppModal>
  );
}
