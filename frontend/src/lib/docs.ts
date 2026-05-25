import { marked } from "marked";
import { DOCS } from "./docs-content";

export interface NavLink {
  title: string;
  slug: string; // empty for root README
  file: string; // path relative to the docs root
}

export interface NavSection {
  heading: string | null;
  links: NavLink[];
}

/** Parse SUMMARY.md into a nav tree. Headings become section titles; list
 *  items pointing at .md files become links. */
export function readSummary(): NavSection[] {
  const raw = DOCS["SUMMARY.md"] ?? "";
  const sections: NavSection[] = [];
  let current: NavSection = { heading: null, links: [] };
  sections.push(current);

  for (const line of raw.split(/\r?\n/)) {
    const headingMatch = /^##\s+(.+)$/.exec(line);
    if (headingMatch) {
      current = { heading: headingMatch[1].trim(), links: [] };
      sections.push(current);
      continue;
    }
    const linkMatch = /^\*\s+\[(.+?)\]\((.+?\.md)\)/.exec(line);
    if (linkMatch) {
      const file = linkMatch[2];
      const slug = file === "README.md" ? "" : file.replace(/\.md$/, "");
      current.links.push({ title: linkMatch[1].trim(), slug, file });
    }
  }
  return sections.filter((s) => s.links.length > 0);
}

/** Render a single doc page. Returns null if not found. */
export function readPage(slug: string): { title: string; html: string } | null {
  if (slug !== "") {
    const safe = slug.split("/").every((p) => /^[a-z0-9-]+$/i.test(p));
    if (!safe) return null;
  }
  const relFile = slug === "" ? "README.md" : `${slug}.md`;
  const raw = DOCS[relFile];
  if (!raw) return null;

  // Strip YAML frontmatter (used by some pages for GitBook-only metadata).
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, "");

  // Pull the first h1 as the page title so the layout can show it without
  // duplicating it inside the rendered HTML.
  let title =
    slug
      .split("/")
      .pop()!
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Welcome";
  const h1Match = /^#\s+(.+)$/m.exec(body);
  if (h1Match) title = h1Match[1].trim();
  const withoutH1 = body.replace(/^#\s+.+\n+/m, "");

  // Rewrite asset paths so they point at the copied files in /public/docs/.
  const rewritten = withoutH1
    .replace(/\(\.\.\/?\.gitbook\/assets\//g, "(/docs/assets/")
    .replace(/\(\.gitbook\/assets\//g, "(/docs/assets/");

  marked.setOptions({ gfm: true, breaks: false });
  const out = marked.parse(rewritten);
  const html = typeof out === "string" ? out : String(out);
  return { title, html };
}

/** Convenience: flat list of slugs (used for generateStaticParams). */
export function listSlugs(): string[] {
  return readSummary()
    .flatMap((s) => s.links)
    .map((l) => l.slug)
    .filter((s) => s !== "");
}
