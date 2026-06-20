import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';

let vertical = 'top'
let horizontal = 'right'

export function ToastMassage(massage, type) {
    if (type == 'success') {
        toast.success(massage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: false,
            theme: "colored",
        });
    } else {
        toast.error(massage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: false,
            theme: "colored",
        });
    }

}
