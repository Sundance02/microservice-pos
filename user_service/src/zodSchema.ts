import { z } from "zod"

export const RegisterSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    user_name: z.string(),
    password: z.string().min(8),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirm_password"],
})

export const LoginSchema = z.object({
    user_name: z.string(),
    password: z.string().min(8),
})