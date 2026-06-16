import { NextResponse } from "next/server";
import pool from "@/lib/db";
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

    // Upload to Cloudinary
    const imagePaths: string[] = [];
    for (const image of validImages) {
      const bytes = await image.arrayBuffer();
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', new Blob([bytes], { type: image.type }));
      cloudinaryFormData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      if (cloudinaryData.secure_url) {
        imagePaths.push(cloudinaryData.secure_url);
      }
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
    for (const imgUrl of imagePaths) {
      await pool.query(
        `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
        [productId, imgUrl]
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