import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(
  request: Request
) {
  try {

    const { productId } =
      await request.json();

    await pool.query(
      `
      DELETE FROM product_images
      WHERE product_id = ?
      `,
      [productId]
    );

    await pool.query(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [productId]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}