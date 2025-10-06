import { defineNuxtPlugin } from '#app'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            toast: {
                success: (msg: string) => toast.success(msg),
                error: (msg: string) => toast.error(msg),
                info: (msg: string) => toast.info(msg),
                warning: (msg: string) => toast.warning(msg),
                default: (msg: string) => toast(msg)
            }
        }
    }
})
