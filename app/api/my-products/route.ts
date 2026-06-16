import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request
) {
  try {

    const { searchParams } =
      new URL(request.url);

    const sellerId =
      searchParams.get("seller_id");

    const [rows] =
      await pool.query(
        `
        SELECT
          p.id,
          p.name,
          p.price,
          MIN(pi.image_url) AS image_url
        FROM products p
        LEFT JOIN product_images pi
          ON p.id = pi.product_id
        WHERE p.seller_id = ?
        GROUP BY p.id, p.name, p.price
        ORDER BY p.id DESC
        `,
        [sellerId]
      );

    return NextResponse.json(rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}