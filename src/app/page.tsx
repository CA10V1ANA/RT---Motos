import { Suspense } from "react";
import { Catalog } from "@/components/public/catalog";
export default function Home() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
