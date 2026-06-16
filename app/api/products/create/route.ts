import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const seller_id = formData.get("seller_id");
    const category_id = formData.get("category_id");
    const name = formData.get("name") as string;
    const price = formData.get("price");
    const size = formData.get("size");
    const condition_percentage = formData.get("condition_percentage");
    const description = formData.get("description");

    // Collect all uploaded images (up to 5)
    const imageFiles = formData.getAll("images[]") as File[];
    const validImages = imageFiles.filter(
      (f) => f instanceof File && f.size > 0
    ).slice(0, 5);

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Save each image file and collect paths
    const imagePaths: string[] = [];
    for (const image of validImages) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuid()}-${image.name.replace(/\s+/g, "_")}`;
      const filePath = join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      imagePaths.push(`/uploads/${filename}`);
    }

    // Insert product
    const [result]: any = await pool.query(
      `
      INSERT INTO products
        (seller_id, category_id, name, slug, price, size, condition_percentage, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [seller_id, category_id, name, slug, price, size, condition_percentage, description]
    );

    const productId = result.insertId;

    // Insert each image into product_images
    for (const imgPath of imagePaths) {
      await pool.query(
        `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
        [productId, imgPath]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dibuat",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat produk" },
      { status: 500 }
    );
  }
}