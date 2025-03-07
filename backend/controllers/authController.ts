import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../schema/users";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { googleId, name, email, picture } = req.body;

    if (!googleId || !email) {
      res.status(400).json({ message: "Google ID and Email are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));

    if (existingUser.length > 0) {
      res.status(200).json({ message: "User already exists" });
      return;
    }

    // Create new user
    await db.insert(users).values({ googleId, name, email, picture });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
