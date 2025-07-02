"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isProductPage = /^\/[^/]+$/.test(pathname) && pathname !== "/";

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary z-50">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between gap-8">
        <Link href="/" className="self-start text-2xl font-extrabold text-violet-700 tracking-tight hover:text-violet-800 transition-colors">
          Clasificados
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/about" className="text-primary font-semibold text-lg hover:text-violet-600 transition-colors">
            About / Contact Info
          </Link>
        </div>
      </div>
    </nav>
  );
}
