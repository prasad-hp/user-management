import { Router } from "express";
import { User } from "../models/index.js";
import { loginSchema, signupSchema } from "../validate/index.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config()
const userRouter = Router();
const JWT_TOKEN = process.env.JWT_TOKEN

userRouter.get("/", async (req,res)=>{
    try {
        const users = await User.find();
        return res.status(200).json({message: "OK", users})
    } catch (error) {
        console.log(error)
    }
});
userRouter.post("/signup", async (req,res)=>{
    try {
        const signupData = signupSchema.safeParse(req.body)
        if(!signupData.success){
            return res.status(400).json({message: signupData.error})
        }
        const checkEmail = await User.findOne({
            email: signupData.data.email
        })
        if(checkEmail){
            return res.status(400).json({message: "Email already exists"})
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(signupData.data.password, salt)
        const createUser = await User.create({
                                name:signupData.data.name,
                                profession: signupData.data.profession,
                                phoneNumber: signupData.data.phoneNumber,
                                email:signupData.data.email,
                                password:hashedPassword
                            })
        if(!createUser){
            return res.status(500).json({message:"An error Occured, please try again"})
        }
        const token = jwt.sign(createUser.id, JWT_TOKEN)
        res.status(201).json({
            message: "User Created Successfully",
            token: token
        })
    } catch (error) {
        console.error(error, "An Error Occured")
    }
})
userRouter.post("/login", async(req,res)=>{
    try {
        const loginData = loginSchema.safeParse(req.body)
        if(!loginData.success){
            return res.status(400).json({message: loginData.error})
        }
        const user = await User.findOne({
            email:loginData.data.email
        })
        if(!user){
            return res.status(400).json({message:"User doesn't exist"})
        }
        const checkPassword = bcrypt.compareSync(loginData.data.password, user.password)
        if(!checkPassword){
            return res.status(400).json({message:"Enter valid Password"})
        }
        const token = jwt.sign(user.id, JWT_TOKEN)
        res.status(200).json({
            message:"Logged In",
            token:token
        })
    } catch (error) {
        console.error(error, "An Error Occured")
    }
})
userRouter.delete("/delete", async(req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({
            email
        })
        if(!user){
            return res.status(400).json("User not found")
        }
        const result = await User.deleteOne({ _id: user._id });

        if (result.deletedCount === 0) {
            return res.status(500).json({ message: "An error occurred while deleting the user" });
        }
        res.status(200).json({message:"User Delete Successfully"})
    } catch (error) {
        console.error(error, "An Error Occured")
    }
})
userRouter.patch("/update", async(req, res) =>{
    try {        
        const {name, phoneNumber, email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const result = await User.updateOne(
            { email },
            {
                $set: {
                    name: name || user.name,
                    phoneNumber: phoneNumber || user.phoneNumber
                }
            }
        );
        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: "An error occurred or no changes were made" });
        }
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error, "An Error Occured")
    }

})


export default userRouter