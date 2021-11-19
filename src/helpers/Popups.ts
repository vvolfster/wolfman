import Swal from "sweetalert2"

type ToastIconType = "error" | "info" | "question" | "success" | "warning" | undefined

export const Toast = (message: string, duration = 3000, icon: ToastIconType = undefined) => {
    return Swal.fire({
        position: "bottom",
        icon,
        title: message,
        showConfirmButton: false,
        timer: duration
    })
}

export const Confirm = async (message: string): Promise<boolean> => {
    const res = await Swal.fire({
        title: message,
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true
    })
    return res.isConfirmed
}

interface DialogProps {
    title: string
    inputValue?: string
    inputValidator?: (value: string) => string | null
    showCancelButton?: boolean
    inputLabel?: string
}

export const Dialog = async (props: DialogProps): Promise<string> => {
    const { title, inputValidator, inputValue, showCancelButton, inputLabel } = props
    const result = await Swal.fire({
        title,
        allowEnterKey: true,
        inputValue,
        input: "text",
        inputLabel: inputLabel || "value",
        inputValidator,
        showCancelButton: showCancelButton === undefined ? true : showCancelButton,
        showConfirmButton: true
    })

    if (!result.isConfirmed) {
        throw new Error(`User canceled`)
    }

    return result.value
}
