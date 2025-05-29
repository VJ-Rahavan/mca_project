import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    encryptDetails,
    isValidEmail,
} from "../lib/functions.js";
import User from "../models/userModel.js";


class auth {
    async signup(req, res) {
        try {
            const { email, username, password } = req.body;

            if (!isValidEmail(email)) {
                return res
                    ?.status(400)
                    .json({ message: "Enter a valid email address" });
            }
            // Check if user is already present
            const checkUserPresent = await User.findOne({ email });
            // If user found with provided email
            if (checkUserPresent) {
                return res.status(401).json({
                    success: false,
                    message: "User is already registered",
                });
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                email,
                password: hashedPassword,
                username,
            });

            await user.save();

            res.status(201).json({
                success: true,
                message: "User created successfully",
            });
        } catch (error) {
            console.log(error?.message);
            return res.status(500).json({ success: false, message: error?.message });
        }
    }

    async login(req, res) {
        const {
            email,
            password,
        } = req.body;

        try {
            if (!isValidEmail(email)) {
                return res
                    ?.status(400)
                    .json({ message: "Enter a valid email address" });
            }
            const existingUser = await User.findOne({ email: email });

            if (!existingUser) {
                return res
                    .status(400)
                    .json({ message: "User not found", success: false });
            }
            if (existingUser && !existingUser.password) {
                return res?.status(400).json({
                    message:
                        'Please login to your account with "Login With Google" option',
                    success: false,
                });
            }

            const passwordMatched = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!passwordMatched) {
                return res
                    .status(400)
                    .json({ message: "Invalid credentials", success: false });
            }

            const jwtToken = jwt.sign(
                {
                    _id: existingUser._id,
                    email: existingUser.email,
                    role: existingUser?.role,
                },
                process.env.JWT_KEY
            );

            const userData = {
                id: existingUser._id,
                username: existingUser?.username,
                email: existingUser?.email,
                role: existingUser?.role
            };
            const encryptedToken = encryptDetails(jwtToken);

            return res
                .status(200)
                .json({ user: userData, token: encryptedToken, success: true });
        } catch (error) {
            return res.status(500).json({ message: error?.message });
        }
    }
}

const Auth = new auth();

export default Auth;
