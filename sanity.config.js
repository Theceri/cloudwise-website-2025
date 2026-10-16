'use client';

/**
 * Sanity Studio configuration — mounted in the Next.js app at /studio.
 * See: src/app/studio/[[...tool]]/page.jsx
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';
import { IssueCertificateAction, IssueClassCertificatesAction } from './src/sanity/actions/issueCertificates';

export default defineConfig({
  name: 'cloudwise-blog',
  title: 'Cloudwise Blog',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Certificate buttons on paid Essentials and Programme bookings.
    actions: (prev, context) =>
      context.schemaType === 'trainingRegistration'
        ? [...prev, IssueCertificateAction, IssueClassCertificatesAction]
        : prev,
  },
});
