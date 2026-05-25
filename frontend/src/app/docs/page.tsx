import { readPage } from "@/lib/docs";
import { notFound } from "next/navigation";

export default function DocsRoot() {
  const page = readPage("");
  if (!page) notFound();
  return (
    <>
      <h1 className="text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-white mb-8">{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </>
  );
}
