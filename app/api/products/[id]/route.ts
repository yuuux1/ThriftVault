import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [productRows]: any = await pool.query(
      `
      SELECT
        p.id,
        p.seller_id,
        p.category_id,
        p.name,
        p.slug,
        p.price,
        p.size,
        p.condition_percentage,
        p.description,
        p.created_at,
        c.name AS category_name,
        u.name AS seller_name,
        u.email AS seller_email
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = ?
      `,
      [id]
    );

    if (productRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const [imageRows]: any = await pool.query(
      `
      SELECT image_url
      FROM product_images
      WHERE product_id = ?
      ORDER BY id ASC
      `,
      [id]
    );

    return NextResponse.json({
      ...productRows[0],
      image_url: imageRows[0]?.image_url ?? null,
      images: imageRows.map((row: { image_url: string }) => row.image_url),
    });

  } catch (error) {
    console.error("Error fetching product detail:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
