import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Parameter userId diperlukan" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT
        c.id,
        c.buyer_id,
        c.seller_id,
        c.product_id,
        c.created_at,
        p.name AS product_name,
        p.price AS product_price,
        pi.image_url AS product_image,
        u_buyer.name AS buyer_name,
        u_seller.name AS seller_name,
        (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY id DESC LIMIT 1) AS last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY id DESC LIMIT 1) AS last_message_time
      FROM conversations c
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN users u_buyer ON c.buyer_id = u_buyer.id
      LEFT JOIN users u_seller ON c.seller_id = u_seller.id
      WHERE c.buyer_id = ? OR c.seller_id = ?
      ORDER BY COALESCE(last_message_time, c.created_at) DESC
      `,
      [userId, userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { buyer_id, seller_id, product_id } = await request.json();

    if (!buyer_id || !seller_id || !product_id) {
      return NextResponse.json(
        { success: false, message: "Field buyer_id, seller_id, dan product_id wajib diisi" },
        { status: 400 }
      );
    }

    // Hindari chat dengan diri sendiri
    if (Number(buyer_id) === Number(seller_id)) {
      return NextResponse.json(
        { success: false, message: "Tidak dapat memulai chat dengan produk Anda sendiri" },
        { status: 400 }
      );
    }

    // Cek apakah percakapan sudah ada
    const [existing]: any = await pool.query(
      `
      SELECT id FROM conversations
      WHERE buyer_id = ? AND seller_id = ? AND product_id = ?
      `,
      [buyer_id, seller_id, product_id]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        conversationId: existing[0].id,
        message: "Percakapan sudah ada",
      });
    }

    // Buat percakapan baru
    const [result]: any = await pool.query(
      `
      INSERT INTO conversations (buyer_id, seller_id, product_id)
      VALUES (?, ?, ?)
      `,
      [buyer_id, seller_id, product_id]
    );

    return NextResponse.json({
      success: true,
      conversationId: result.insertId,
      message: "Percakapan berhasil dibuat",
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
