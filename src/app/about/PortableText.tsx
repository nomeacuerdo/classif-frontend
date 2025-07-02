import { PortableText } from '@portabletext/react';
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import type { TypedObject } from '@portabletext/types';
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";

type ImageValue = {
  width: number;
  asset?: SanityImageSource;
  alt?: string;
};

interface MyPortableTextProps {
  value: TypedObject | TypedObject[];
}

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const components = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      const imageBuilder = urlFor(value);
      const imageUrl = imageBuilder ? imageBuilder.width(400).height(300).fit("crop").url() : null;

      return (
        value?.asset && imageBuilder && imageUrl ? (
          <div style={{ position: "relative", width: "500px", aspectRatio: "4/3", margin: "5rem auto", borderRadius: 8, overflow: "hidden" }}>
            <Image
              src={imageUrl}
              alt={value.alt || ''}
              fill
              style={{ objectFit: "cover", borderRadius: 8 }}
              sizes="(max-width: 600px) 50vw, 400px"
            />
          </div>
        ) : null
      );
  }},
}

export default function MyPortableText({ value }: MyPortableTextProps) {
  return <PortableText value={value} components={components} />
}