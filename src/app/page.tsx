import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { client } from "@/sanity/client";
// *[_type == "product"]{ _id, title, subtitle, images, negociable, publishedAt }
const PRODUCTS_QUERY = `*[
  _type == "product"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, price, images, negociable, published}`;

const options = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const products = await client.fetch<SanityDocument[]>(PRODUCTS_QUERY, {}, options);
  const publishedProducts = products.filter((product) => product.published);

  return (
    <main className="container mx-auto min-h-screen p-8 flex flex-col gap-8 items-center py-10 mt-20">
      <ul className="flex flex-col items-center w-full gap-y-0">
        {publishedProducts.map((product, idx) => {
          const productImageUrl =
            product.images.length > 0
              ? urlFor(product.images[0])?.width(400).height(300).fit("crop").url()
              : null;

          return (
            <li
              className={`flex flex-row items-center w-full h-[300px] pb-5 mb-5 
                ${idx < publishedProducts.length - 1 ? "border-b border-gray-300" : ""}`}
              key={product._id}
            >
              <Link
                href={`/${product.slug.current}`}
                className="flex-shrink-0 h-full w-1/3 lg:w-[25%] flex items-center justify-center rounded-2xl overflow-hidden hover:text-violet-600 transition-colors"
              >
                {productImageUrl ? (
                  <Image
                    src={productImageUrl}
                    alt={product.title}
                    className="object-cover w-full h-full"
                    width={400}
                    height={300}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </Link>
              <div className="flex flex-col justify-start px-8 py-6 w-2/3 lg:w-[75%] h-full">
                <Link href={`/${product.slug.current}`} className="text-white hover:text-violet-600 transition-colors">
                  <h3 className="text-3xl font-bold mb-4">{product.title}</h3>
                </Link>
                <p className="text-lg text-gray-500">
                  {new Date(product.publishedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).replace(/ /g, " / ")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
