import { ToastId, UseToastOptions } from "@chakra-ui/react";
type ToastStatus = "info" | "warning" | "success" | "error" | "loading" | undefined;

export const showToast = (title: string, description: string, status: ToastStatus, toast: {
    (options?: UseToastOptions | undefined): ToastId
}) => {
    return toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
        position: "top-right",
    });

};

