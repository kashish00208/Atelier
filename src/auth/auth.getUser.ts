import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import tr from "zod/v4/locales/tr.js";

interface AuthRequest extends Request {
  userId?: number;
}

export async function getUSerProfile(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
