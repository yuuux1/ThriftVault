"use client";

import { useEffect, useState } from "react";
import { categories as localCategories } from "@/data/categories";
import { Shirt } from "lucide-react";
import CategoryCard from "./CategoryCard";

type CategorySectionProps = {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
};

type DbCategory = {
  id: number;
  name: string;
};

export default function CategorySection({
  selectedCategoryId,
  onSelectCategory,
}: CategorySectionProps) {
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setDbCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const getIconForCategoryName = (name: string) => {
    const matched = localCategories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return matched ? matched.icon : Shirt;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[var(--thrift-ink)]">
            Kategori Pilihan
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Temukan barang thrift impianmu berdasarkan kategori
          </p>
        </div>

        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-sm font-semibold text-[var(--thrift-rose)] hover:underline"
          >
            Hapus Filter
          </button>
        )}
      </div>

      <div
        className="
          flex
          gap-4
          overflow-x-auto
          pb-4
          scrollbar-thin
        "
      >
        {loading ? (
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-32 h-32 rounded-2xl bg-amber-100/40 animate-pulse border border-[rgba(15,156,154,0.08)]"
              />
            ))}
          </div>
        ) : (
          dbCategories.map((category) => {
            const Icon = getIconForCategoryName(category.name);
            const isActive = selectedCategoryId === category.id;
            return (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={Icon}
                isActive={isActive}
                onClick={() =>
                  onSelectCategory(isActive ? null : category.id)
                }
              />
            );
          })
        )}
      </div>
    </section>
  );
}