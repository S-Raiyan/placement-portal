import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/database.js";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@placementportal.com";
        const password = "Admin@12345";

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            name: "Placement Admin",
            email,
            username: "placementadmin",
            password: hashedPassword,
            role: "admin"
        });

        console.log("=================================");
        console.log("✅ Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Username:", admin.username);
        console.log("Password:", password);
        console.log("=================================");

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Failed to create admin:", error.message);

        await mongoose.connection.close();
        process.exit(1);
    }
};

createAdmin();