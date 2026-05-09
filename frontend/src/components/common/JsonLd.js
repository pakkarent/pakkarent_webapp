import { useEffect, useId } from 'react';

/**
 * JsonLd — injects a <script type="application/ld+json"> into <head>
 * scoped to the component lifecycle. Cleans up on unmount or change.
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", ... }} />
 *   <JsonLd data={[ ...multipleSchemas ]} id="optional-stable-id" />
 */
export default function JsonLd({ data, id }) {
  const reactId = useId();
  const scriptId = id || `jsonld-${reactId.replace(/:/g, '_')}`;

  useEffect(() => {
    if (!data) return undefined;
    const payload = Array.isArray(data) ? data : [data];

    const existing = document.getElementById(scriptId);
    const el = existing || document.createElement('script');
    el.type = 'application/ld+json';
    el.id = scriptId;
    el.text = JSON.stringify(payload.length === 1 ? payload[0] : payload);
    if (!existing) document.head.appendChild(el);

    return () => {
      const node = document.getElementById(scriptId);
      if (node && node.parentNode) node.parentNode.removeChild(node);
    };
  }, [data, scriptId]);

  return null;
}
