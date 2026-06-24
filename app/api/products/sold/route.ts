import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const { productId, is_sold } = await request.json();

    if (productId === undefined || is_sold === undefined) {
      return NextResponse.json(
        { success: false, message: "productId dan is_sold wajib diisi" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE products SET is_sold = ? WHERE id = ?`,
      [is_sold ? 1 : 0, productId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating sold status:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
