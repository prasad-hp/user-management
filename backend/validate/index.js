import zod, { string } from "zod";

export const signupSchema = zod.object({
    name:zod.string(),
    profession:zod.string(),
    phoneNumber: zod.string(),
    email:zod.string().email({ message: "Invalid email address" }),
    password:string().min(6, { message: "Password must be 6 or more characters long" })
})
export const loginSchema = zod.object({
    email:zod.string().email({ message: "Invalid email address" }),
    password:string().min(6, { message: "Password must be 6 or more characters long" })
})