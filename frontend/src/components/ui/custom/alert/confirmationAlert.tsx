import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../alert-dialog";

const ConfirmationAlert = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<"button"> & {
    onConfirmation: () => void;
    description?: string;
    title?: string;
    confirmSlot?: React.ReactNode;
    children?: React.ReactNode;
  }
>(
  (
    {
      onConfirmation,
      title,
      description,
      confirmSlot,
      children = true,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    const handleOnClickConfirm = () => {
      onConfirmation();
      // // Only close the dialog if closeOnConfirm is true
      // if (closeOnConfirm) {
      //   setOpen(false);
      // }
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          ref={ref}
          {...props}
          asChild
          onClick={() => setOpen(false)}
        >
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[80vw] rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{title ?? "Apakah Anda yakin?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {description ??
                " Tindakan ini tidak dapat dikembalikan setelah dieksekusi."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="w-full"
              onClick={handleOnClickConfirm}
            >
              {confirmSlot ?? "Konfirmasi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

export default ConfirmationAlert;
