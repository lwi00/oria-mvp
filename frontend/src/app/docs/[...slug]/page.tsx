import { listSlugs, readPage } from "@/lib/docs";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export default function DocsPage({ params }: { params: { slug?: string[] } }) {
  const slug = (params.slug ?? []).join("/");
  const page = readPage(slug);
  if (!page) notFound();
  return (
    <>
      <h1 className="text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-white mb-8">
        {page.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </>
  );
}
