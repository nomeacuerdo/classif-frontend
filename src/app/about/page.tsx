import { type SanityDocument } from "next-sanity";
import PortableText from "./PortableText";
import { client } from "@/sanity/client";

// *[_type == "page"]{ _id, title, content, publishedAt }
const PAGE_QUERY = `*[_type == "page" && slug.current == 'about'][0]`;
const options = { next: { revalidate: 30 } };

export default async function AboutPage() {
  const page = await client.fetch<SanityDocument>(PAGE_QUERY, {}, options);

  if (!page) return <div className="pt-24 text-center">Loading...</div>;

  return (
    <main className="container mx-auto min-h-screen p-8 flex flex-col md:flex-row gap-8 pt-24">
      <section className="w-full flex flex-col gap-4">
        <h1
          className="text-5xl font-extrabold mb-12 text-primary text-center"
          style={{ fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'" }}
        >
          {page.title ?? ""}
        </h1>

        <div className="prose prose-lg text-gray-200 mb-4">
          {Array.isArray(page.content) && <PortableText value={page.content} />}
        </div>
      </section>
    </main>
  );
}
