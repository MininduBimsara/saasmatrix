import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiter: 10 checkout attempts per IP per minute.
// Falls back gracefully if Upstash env vars are not configured.
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: false,
    prefix: 'saaspebble:checkout',
  });
}

const allowedOrigins = [
  'https://saaspebble.tech',
  'https://www.saaspebble.tech',
  'http://localhost:3000',
];

const MAX_BODY_BYTES = 4096;

const PLAN_DETAILS = {
  'founder-pro': {
    name: 'Founder Pro Directory Placement',
    monthlyPriceInCents: 4900,
    yearlyPriceInCents: 3900 * 12,
    variantEnvKey: 'LEMON_SQUEEZY_VARIANT_FOUNDER_PRO' as const,
  },
  'enterprise-buyer': {
    name: 'Enterprise Procurement Intelligence',
    monthlyPriceInCents: 1900,
    yearlyPriceInCents: 1500 * 12,
    variantEnvKey: 'LEMON_SQUEEZY_VARIANT_ENTERPRISE_BUYER' as const,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function enforceRateLimit(req: NextRequest): Promise<NextResponse | null> {
  if (!ratelimit) return null;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  if (success) return null;
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
      },
    }
  );
}

function validateRequestHeaders(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin') ?? '';
  const isAllowed =
    allowedOrigins.includes(origin) ||
    (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost'));
  if (!isAllowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 });
  }

  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
  }

  return null;
}

function validateBody(body: unknown): NextResponse | null {
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const { planId, billingCycle, successUrl } = body as Record<string, unknown>;
  const optionalString = (v: unknown) => v === undefined || typeof v === 'string';
  if (typeof planId !== 'string' || typeof billingCycle !== 'string' || !optionalString(successUrl)) {
    return NextResponse.json({ error: 'Invalid request fields.' }, { status: 400 });
  }
  return null;
}

async function callLemonSqueezy(
  apiKey: string,
  storeId: string,
  variantId: string,
  redirectSuccess: string,
): Promise<{ url: string; id: string } | NextResponse> {
  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        product_options: { redirect_url: redirectSuccess },
        checkout_options: { embed: false, button_color: '#2563eb' },
      },
      relationships: {
        store: { data: { type: 'stores', id: storeId.trim() } },
        variant: { data: { type: 'variants', id: variantId.trim() } },
      },
    },
  };

  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const detail = data?.errors?.[0]?.detail ?? 'Unknown Lemon Squeezy API error';
    return NextResponse.json({ error: `Lemon Squeezy API error: ${detail}` }, { status: res.status });
  }

  const url = data?.data?.attributes?.url;
  if (!url) {
    return NextResponse.json({ error: 'Did not receive a checkout URL from Lemon Squeezy.' }, { status: 500 });
  }
  return { url, id: data.data.id };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rateLimitError = await enforceRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const headerError = validateRequestHeaders(req);
  if (headerError) return headerError;

  try {
    const body = await req.json();
    const bodyError = validateBody(body);
    if (bodyError) return bodyError;

    const { planId, billingCycle, successUrl } = body as {
      planId: string; billingCycle: string; successUrl?: string;
    };

    const plan = PLAN_DETAILS[planId as keyof typeof PLAN_DETAILS];
    if (!plan) return NextResponse.json({ error: 'Selected pricing plan is invalid.' }, { status: 400 });

    const priceInCents = billingCycle === 'yearly' ? plan.yearlyPriceInCents : plan.monthlyPriceInCents;
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env[plan.variantEnvKey] ?? '';
    
    if (process.env.NODE_ENV === 'production') {
      const origin = req.headers.get('origin') ?? 'https://saaspebble.tech';
      if (!allowedOrigins.includes(origin)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const origin = req.headers.get('origin') ?? 'https://saaspebble.tech';
    const redirectSuccess = successUrl ?? `${origin}/subscribe/success?planId=${planId}&cycle=${billingCycle}`;

    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json({
        isSandbox: true,
        session: {
          id: `sim_ls_${Math.random().toString(36).substring(2, 15)}`,
          url: `/subscribe/sandbox-success?planId=${planId}&cycle=${billingCycle}&amount=${priceInCents / 100}`,
          amount_total: priceInCents,
          currency: 'usd',
          payment_status: 'unpaid',
        },
        message: 'Lemon Squeezy credentials absent. Running visual sandbox emulation.',
      });
    }

    const result = await callLemonSqueezy(apiKey, storeId, variantId, redirectSuccess);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ isSandbox: false, session: { id: result.id, url: result.url } });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Lemon Squeezy checkout error:', msg);
    return NextResponse.json({ error: `Checkout pipeline error: ${msg}` }, { status: 500 });
  }
}
