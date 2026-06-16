import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM categories
      ORDER BY name ASC
      `
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil kategori",
      },
      { status: 500 }
    );
  }
}