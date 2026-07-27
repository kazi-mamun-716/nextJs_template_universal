/**
 * JSON-LD structured data component for rich search results.
 * Injects schema.org structured data into the page head.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
