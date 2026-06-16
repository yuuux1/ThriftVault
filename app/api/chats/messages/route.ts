import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "Parameter conversationId diperlukan" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT id, conversation_id, sender_id, message_text, created_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY id ASC
      `,
      [conversationId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { conversation_id, sender_id, message_text } = await request.json();

    if (!conversation_id || !sender_id || !message_text || !message_text.trim()) {
      return NextResponse.json(
        { success: false, message: "Field conversation_id, sender_id, dan message_text wajib diisi" },
        { status: 400 }
      );
    }

    // Masukkan ke database
    const [result]: any = await pool.query(
      `
      INSERT INTO messages (conversation_id, sender_id, message_text)
      VALUES (?, ?, ?)
      `,
      [conversation_id, sender_id, message_text.trim()]
    );

    const [newMsg]: any = await pool.query(
      `SELECT * FROM messages WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: newMsg[0],
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
