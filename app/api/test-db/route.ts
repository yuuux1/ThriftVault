import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products"
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}