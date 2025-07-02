import { PortableText } from '@portabletext/react'
import { urlFor } from '../../sanity/client';
import type { TypedObject } from '@portabletext/types';

type ImageValue = {
  asset?: any;
  alt?: string;
};

interface MyPortableTextProps {
  value: TypedObject | TypedObject[];
}

const components = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      value?.asset ? (
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || ''}
          style={{ maxWidth: '100%', borderRadius: 8 }}
        />
      ) : null
    ),
  },
}

export default function MyPortableText({ value }: MyPortableTextProps) {
  return <PortableText value={value} components={components} />
}