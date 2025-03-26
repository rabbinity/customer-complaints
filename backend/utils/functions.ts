import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  const secret: string = process.env.JWT_SECRET || "your_secret_key_here";
  return jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });
};
  