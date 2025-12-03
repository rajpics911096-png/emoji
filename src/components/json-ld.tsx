
"use client";

import { createElement } from 'react';
import type { WithContext, Thing } from 'schema-dts';

type JsonLdProps = {
  data: WithContext<Thing>;
};

export function JsonLd({ data }: JsonLdProps) {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}

    