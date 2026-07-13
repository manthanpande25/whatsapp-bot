import bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { IUser } from "../interfaces/user.interface";
import { COLLECTIONS } from "../constants/collections";
import { generateToken } from "../utils/jwt";

class AuthService {
  async register(userData: IUser) {
    try {
      const { name, email, password } = userData;

      const existingUser = await db
        .collection(COLLECTIONS.USERS)
        .where("email", "==", email)
        .get();

      if (!existingUser.empty) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userRef = db.collection(COLLECTIONS.USERS).doc();

      await userRef.set({
        id: userRef.id,
        name,
        email,
        password: hashedPassword,
        role: "OWNER",
        organizationId: "",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        message: "User registered successfully",
        userId: userRef.id,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userSnapshot = await db
        .collection(COLLECTIONS.USERS)
        .where("email", "==", email)
        .get();

      if (userSnapshot.empty) {
        throw new Error("Invalid email or password");
      }

      const user = userSnapshot.docs[0].data() as IUser;

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user.id!);

      return {
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();