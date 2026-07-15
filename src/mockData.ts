import { Client, Project, Retainer, DocumentAndNote, WebhookAlert, AppState } from './types';

// Let's assume current system date is July 15, 2026 as per metadata
export const CURRENT_DATE_STR = '2026-07-15';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    company_name: 'Acme Corp Solutions',
    primary_contact_name: 'Sarah Jenkins',
    email: 'sarah.j@acmecorp.com',
    phone: '+1 (555) 019-2834',
    status: 'active',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    company_name: 'Zenith Retail Group',
    primary_contact_name: 'Marcus Chen',
    email: 'm.chen@zenithretail.co',
    phone: '+1 (555) 438-9012',
    status: 'active',
    created_at: '2026-03-15T14:30:00Z',
    updated_at: '2026-03-15T14:30:00Z',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    company_name: 'Vortex Crypto Tech',
    primary_contact_name: 'Elena Rostova',
    email: 'elena@vortextech.io',
    phone: '+44 20 7946 0192',
    status: 'paused',
    created_at: '2026-05-02T09:15:00Z',
    updated_at: '2026-05-02T09:15:00Z',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    company_name: 'Nova Bioscience',
    primary_contact_name: 'Dr. Arthur Pendelton',
    email: 'pendelton@novabio.org',
    phone: '+1 (555) 876-5432',
    status: 'inactive',
    created_at: '2025-11-20T11:00:00Z',
    updated_at: '2026-02-14T16:20:00Z',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    client_id: 'c1111111-1111-1111-1111-111111111111',
    project_name: 'Acme E-Commerce Platform Redesign',
    start_date: '2026-06-01',
    end_date: '2026-07-17', // Exactly 2 days from July 15, 2026! Fires the deadline alert.
    invoiced_amount: 18500,
    short_note: 'Complete overhaul of core B2B purchasing funnel and Tailwind design upgrade. Needs final client review of staging build.',
    staging_url: 'https://acme-staging.conextsol.dev',
    production_url: 'https://b2b.acmesolutions.com',
    github_url: 'https://github.com/conextsol-agency/acme-b2b-redesign',
    services_listed: ['UI/UX Redesign', 'Next.js 14 Development', 'Stripe Multi-vendor Billing', 'PostgreSQL Optimization'],
    associated_emails: ['sarah.j@acmecorp.com', 'dev-team@conextsol.com', 'billing@acmecorp.com'],
    created_at: '2026-06-01T08:00:00Z',
    updated_at: '2026-07-10T15:30:00Z',
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    client_id: 'c2222222-2222-2222-2222-222222222222',
    project_name: 'Zenith Inventory Dashboard & Mobile App',
    start_date: '2026-04-10',
    end_date: '2026-08-30',
    invoiced_amount: 24000,
    short_note: 'Warehouse real-time stock sync with barcode scanner API. React Native client setup completed.',
    staging_url: 'https://zenith-inventory-stage.conextsol.dev',
    production_url: '',
    github_url: 'https://github.com/conextsol-agency/zenith-inventory-core',
    services_listed: ['Tailwind UI Dashboard', 'React Native App', 'Express Server Integration', 'Barcode Scanner SDK'],
    associated_emails: ['m.chen@zenithretail.co', 'pm-lead@conextsol.com'],
    created_at: '2026-04-10T09:00:00Z',
    updated_at: '2026-07-12T11:45:00Z',
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    client_id: 'c3333333-3333-3333-3333-333333333333',
    project_name: 'Vortex Crypto Trading API Integration',
    start_date: '2026-05-10',
    end_date: '2026-07-28',
    invoiced_amount: 15000,
    short_note: 'Implementing highly performant WebSockets and D3 real-time charts. Project paused temporarily by client request.',
    staging_url: 'https://vortex-api-stage.conextsol.dev',
    production_url: '',
    github_url: 'https://github.com/conextsol-agency/vortex-websockets',
    services_listed: ['WebSocket Channels', 'D3.js Data Engine', 'Tailwind Dark HUD UI'],
    associated_emails: ['elena@vortextech.io', 'lead-architect@conextsol.com'],
    created_at: '2026-05-10T10:00:00Z',
    updated_at: '2026-06-15T14:10:00Z',
  }
];

export const INITIAL_RETAINERS: Retainer[] = [
  {
    id: 'r1111111-1111-1111-1111-111111111111',
    client_id: 'c1111111-1111-1111-1111-111111111111',
    service_type: 'web maintenance',
    billing_amount: 1200,
    billing_cycle_day: 15, // Matches current day 15! Fires the retainer invoicing alert.
    is_active: true,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'r2222222-2222-2222-2222-222222222222',
    client_id: 'c1111111-1111-1111-1111-111111111111',
    service_type: 'Google Ads',
    billing_amount: 2500,
    billing_cycle_day: 1,
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'r3333333-3333-3333-3333-333333333333',
    client_id: 'c2222222-2222-2222-2222-222222222222',
    service_type: 'SEO',
    billing_amount: 1800,
    billing_cycle_day: 15, // Also matches current day 15!
    is_active: true,
    created_at: '2026-04-15T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z',
  },
  {
    id: 'r4444444-4444-4444-4444-444444444444',
    client_id: 'c3333333-3333-3333-3333-333333333333',
    service_type: 'web hosting',
    billing_amount: 250,
    billing_cycle_day: 20,
    is_active: false, // Inactive retainer
    created_at: '2026-05-15T00:00:00Z',
    updated_at: '2026-06-15T10:00:00Z',
  }
];

export const INITIAL_DOCUMENTS: DocumentAndNote[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    title: 'Acme Stripe Webhook Key Rotation Guide',
    content: `### Stripe Integration Production Setup

This document outlines the webhook signing keys rotation and endpoint verification for **Acme Corp Solutions**.

#### 1. Endpoint Configuration
- **Production URL:** \`https://b2b.acmesolutions.com/api/webhooks/stripe\`
- **Staging URL:** \`https://acme-staging.conextsol.dev/api/webhooks/stripe\`
- **API Version:** \`2023-10-16\`

#### 2. Environment Variables Required
\`\`\`env
STRIPE_SECRET_KEY=sk_live_51M...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

#### 3. Steps to Rotate Keys (Admin Only)
1. Go to **Stripe Dashboard** -> Developers -> Webhooks.
2. Select the endpoint and click **Rotate Secret**.
3. Choose the 24-hour buffer window option to prevent transaction disruption.
4. Update the \`STRIPE_WEBHOOK_SECRET\` variable inside Supabase vault / Vercel panel.
5. Trigger a mock charge and check the logs in the portal.`,
    file_references: ['/storage/acme_stripe_spec.pdf', 'https://stripe.com/docs/api'],
    created_at: '2026-06-12T09:00:00Z',
    updated_at: '2026-07-10T12:00:00Z',
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    project_id: 'p2222222-2222-2222-2222-222222222222',
    title: 'Zenith Retail Warehouse Barcode API Integration Speccing',
    content: `### Zenith Mobile Stock Scan Spec

Details regarding the React Native camera scanning library and custom inventory sync API endpoints.

#### Camera Integration Library
We are utilizing \`react-native-vision-camera\` paired with the \`@vdoc/barcode-scanner-plugin\` for fast low-latency detection of standard B2B inventory barcodes (UPC-A, EAN-13, and Code-128).

#### Core Sync Endpoint
- **Path:** \`POST /api/v1/inventory/sync-scan\`
- **Headers:**
  - \`Authorization: Bearer <JWT>\`
  - \`Content-Type: application/json\`
- **Request Schema:**
  \`\`\`json
  {
    "barcode": "012345678905",
    "scanned_at": "2026-07-15T04:20:00Z",
    "warehouse_id": "wh_east_04",
    "quantity_offset": 1
  }
  \`\`\`

#### Next Steps:
- Complete the camera layout view on iOS 17 devices.
- Run database lock contention test with 50 simultaneous scanner clients.`,
    file_references: ['/storage/zenith_scan_flows.png'],
    created_at: '2026-04-18T11:00:00Z',
    updated_at: '2026-07-11T16:00:00Z',
  }
];

export const INITIAL_ALERTS_LOG: WebhookAlert[] = [
  {
    id: 'a1',
    timestamp: '2026-07-14T08:00:00Z',
    type: 'deadline',
    title: 'Acme E-Commerce Platform Redesign Deadline Warning',
    message: '⚠️ Telegram Alert Sent: Project "Acme E-Commerce Platform Redesign" for client "Acme Corp Solutions" is finishing on 2026-07-17 (In 3 Days). Please verify the QA tests are complete.',
    recipient: 'Telegram Admin Channel (@conextsol_ops)',
    status: 'sent',
  },
  {
    id: 'a2',
    timestamp: '2026-07-15T00:05:00Z',
    type: 'retainer',
    title: 'Zenith SEO Billing Due Today',
    message: '💰 Telegram Alert Sent: Client "Zenith Retail Group" has an active SEO retainer due today. Invoiced amount: $1,800.00.',
    recipient: 'Telegram Admin Billing Feed',
    status: 'sent',
  }
];

export function getInitialState(): AppState {
  const saved = localStorage.getItem('conextsol_portal_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure basic keys exist
      if (parsed.clients && parsed.projects) {
        return {
          ...parsed,
          isAdmin: parsed.isAdmin !== undefined ? parsed.isAdmin : true,
          userEmail: parsed.userEmail !== undefined ? parsed.userEmail : 'reeqieric41@gmail.com',
        };
      }
    } catch (e) {
      console.error('Failed to parse saved state, resetting', e);
    }
  }

  return {
    clients: INITIAL_CLIENTS,
    projects: INITIAL_PROJECTS,
    retainers: INITIAL_RETAINERS,
    documents: INITIAL_DOCUMENTS,
    alertsLog: INITIAL_ALERTS_LOG,
    isAdmin: true, // Default as Admin for demonstration
    userEmail: 'reeqieric41@gmail.com', // Pre-populated from user metadata
  };
}

export function saveState(state: AppState) {
  localStorage.setItem('conextsol_portal_state', JSON.stringify(state));
}
