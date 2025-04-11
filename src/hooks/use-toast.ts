"use client"

import { toast as sonnerToast } from "sonner"

export function useToast() {
    return {
        toast: sonnerToast,
        dismiss: (toastId?: string) => {
            if (toastId) {
                sonnerToast.dismiss(toastId)
            } else {
                sonnerToast.dismiss()
            }
        },
    }
}

export { sonnerToast as toast }