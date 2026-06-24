import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    let query = `
      SELECT
        p.id,
        p.name,
        p.price,
        p.category_id,
        p.is_sold,
        MIN(pi.image_url) AS image_url
      FROM products p
      LEFT JOIN product_images pi
      ON p.id = pi.product_id
    `;
    
    const params: any[] = [];
    if (categoryId) {
      query += ` WHERE p.category_id = ?`;
      params.push(categoryId);
    }

    query += `
      GROUP BY p.id, p.name, p.price, p.category_id, p.is_sold, p.created_at
      ORDER BY p.created_at DESC
    `;

    const [rows]: any = await pool.query(query, params);

    return NextResponse.json(rows);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
}