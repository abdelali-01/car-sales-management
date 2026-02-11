import React from "react";
import { Metadata } from "next";
import NotFound from "@/components/common/NotFound";

export const metadata: Metadata = {
  title: "Next.js Error 404 | Soft Linge - Next.js Dashboard Template",
  description:
    "This is Next.js Error 404 page for Soft Linge - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Error404() {
  return <NotFound />;
}
