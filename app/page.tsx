"use client";

import { useState } from "react";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";
import CategorySection from "@/components/home/CategorySection";
import NewestProducts from "@/components/home/NewestProducts";
import PopularProducts from "@/components/home/PopularProducts";

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <>
      <Hero />
      <SearchBar />
      <CategorySection
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      <NewestProducts
        selectedCategoryId={selectedCategoryId}
        onClearFilter={() => setSelectedCategoryId(null)}
      />
      <PopularProducts />
    </>
  );
}