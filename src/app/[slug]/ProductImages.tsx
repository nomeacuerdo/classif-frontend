"use client"

import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useState } from "react";

type ProductImagesProps = {
  images: SanityImageSource[];
  title: string;
};

const urlFor = (projectId: string, dataset: string, source: SanityImageSource) =>
  imageUrlBuilder({ projectId, dataset }).image(source);

export default function ProductImages({ images, title }: ProductImagesProps) {
  const config = client.config();
  const projectId = config.projectId ?? "";
  const dataset = config.dataset ?? "";
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const mainImage = images[mainImageIdx];

  return (
    <section className="lg:w-1/3 w-full flex flex-col items-center">
      {mainImage && (
        <img
          src={urlFor(projectId, dataset, mainImage)?.fit("max").auto("format").url()}
          alt={title}
          className="rounded-2xl object-contain w-full h-[540px] bg-gray-100 border-4 border-black shadow-lg"
          
        />
      )}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 w-full justify-center flex-wrap">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMainImageIdx(idx)}
              className={`rounded-lg border-2 cursor-pointer transition ${
                mainImageIdx === idx
                  ? "border-violet-600"
                  : "border-transparent hover:border-violet-600 transition-colors"
              }`}
              style={{ padding: 0 }}
            >
              <img
                src={urlFor(projectId, dataset, img)?.width(80).height(60).fit("crop").auto("format").url()}
                alt={`Thumbnail ${idx + 1}`}
                className="object-cover w-20 h-14 rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
