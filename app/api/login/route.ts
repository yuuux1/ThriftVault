import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function POST(
  request: Request
) {
  try {
    const { email, password } =
      await request.json();

    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email tidak ditemukan",
        },
        { status: 400 }
      );
    }

    const user = rows[0];

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password salah",
        },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan",
      },
      { status: 500 }
    );
  }
}