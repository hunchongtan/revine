import { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "destructive"

type ToastOptions = {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  [key: string]: unknown
}

function showToast({ title, description, variant = "default", duration, ...rest }: ToastOptions = {}) {
  const message = title ?? description ?? ""
  const toastArgs = {
    description: title && description ? description : description,
    duration,
    ...rest,
  }

  if (!message) {
    sonnerToast("", toastArgs)
    return
  }

  if (variant === "destructive") {
    sonnerToast.error(message, toastArgs)
    return
  }

  sonnerToast(message, toastArgs)
}

export function useToast() {
  return { toast: showToast }
}

export { showToast as toast }
