/**
 * Slug generation utilities.
 */

interface SlugOptions {
  /** Separator between words (default: "-") */
  separator?: string;
  /** Max length of the slug */
  maxLength?: number;
  /** Whether to lowercase the slug (default: true) */
  lowercase?: boolean;
  /** Additional characters to preserve (e.g., "_") */
  preserve?: string;
}

/**
 * Converts a string to a URL-friendly slug.
 *
 * @example
 * slugify("Hello World!") // "hello-world"
 * slugify("Hello World", { separator: "_" }) // "hello_world"
 * slugify("Hello World", { maxLength: 8 }) // "hello"
 */
export function slugify(text: string, options: SlugOptions = {}): string {
  const {
    separator = "-",
    maxLength = 0,
    lowercase = true,
    preserve = "",
  } = options;

  // Build character class: preserve given chars, remove everything else
  const preservePattern = preserve ? `\\w\\s${preserve.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` : "\\w\\s";

  let slug = text
    .normalize("NFKD")                    // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, "")      // Remove diacritics (accents)
    .trim();

  if (lowercase) slug = slug.toLowerCase();

  slug = slug
    .replace(new RegExp(`[^${preservePattern}]`, "g"), "")  // Remove unwanted chars
    .replace(/[\s_]+/g, separator)                          // Replace spaces/underscores with separator
    .replace(new RegExp(`${separator}+`, "g"), separator)   // Collapse consecutive separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), ""); // Trim leading/trailing separators

  if (maxLength > 0) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}[^${separator}]*$`), "");
  }

  return slug;
}

/**
 * Generates a unique slug by appending a suffix if the slug already exists.
 *
 * @example
 * uniqueSlug("hello-world", new Set(["hello-world"])) // "hello-world-1"
 */
export function uniqueSlug(
  baseSlug: string,
  existingSlugs: Set<string>,
  separator = "-",
): string {
  if (!existingSlugs.has(baseSlug)) return baseSlug;

  let counter = 1;
  while (existingSlugs.has(`${baseSlug}${separator}${counter}`)) {
    counter++;
  }

  return `${baseSlug}${separator}${counter}`;
}

/**
 * Converts a string to a filename-safe slug.
 *
 * @example
 * filenameSlug("My File (v2).pdf") // "my-file-v2.pdf"
 */
export function filenameSlug(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return slugify(filename);
  const name = filename.slice(0, lastDot);
  const ext = filename.slice(lastDot);
  return `${slugify(name)}${ext.toLowerCase()}`;
}
