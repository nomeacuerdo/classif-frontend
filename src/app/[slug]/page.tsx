import { PortableText, type SanityDocument } from "next-sanity";
import Link from "next/link";
import { client } from "@/sanity/client";
import ProductImages from "./ProductImages";

// *[_type == "product"]{ _id, title, price, images, negociable, publishedAt }
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0]`;

const options = { next: { revalidate: 30 } };

export default async function ProductPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await client.fetch<SanityDocument>(PRODUCT_QUERY, { slug }, options);

  if (!product) return <div className="pt-24 text-center">Loading...</div>;

  const images = product.images || [];

  return (
    <>
      {/* Main layout */}
      <main className="container mx-auto min-h-screen p-8 flex flex-col gap-8 pt-24">
        <Link href="/" className="text-primary font-semibold text-lg hover:text-violet-600 transition-colors">
          ← Back home
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Images */}
          <ProductImages images={images} title={product.title ?? ""} />
          {/* Right: Details */}
          <section className="md:w-2/3 w-full flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {product.title}
            </h2>
            <div className="flex items-center gap-4 mb-2">
              <span className={`text-2xl font-bold text-gray-700 ${product.negociable ? "line-through text-gray-300" : "text-white"}`}>
                {product.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              {product.negociable && (
                <span className="text-green-600 font-bold text-lg bg-green-100 px-3 py-1 rounded-full">
                  Negociable!
                </span>
              )}
            </div>
            <div className="prose prose-lg text-gray-200 mb-4">
              {Array.isArray(product.description) && <PortableText value={product.description} />}
            </div>
            <p className="italic text-gray-400 text-sm mt-auto">
              Published: {new Date(product.publishedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).replace(/ /g, " / ")}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
