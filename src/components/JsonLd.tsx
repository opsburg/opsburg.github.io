/**
 * Renders structured data. Kept as a server component with a plain script tag
 * so the JSON-LD is present in the statically exported HTML rather than being
 * injected after hydration, which crawlers cannot rely on.
 */
export default function JsonLd({ schema }: { schema: object | object[] }) {
  const payload = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
