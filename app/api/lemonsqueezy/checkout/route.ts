import { NextRequest, NextResponse } from 'next/server';

// Plan details configuration
const PLAN_DETAILS = {
  'founder-pro': {
    name: 'Founder Pro Directory Placement',
    monthlyPriceInCents: 4900,
    yearlyPriceInCents: 3900 * 12,
    description: 'Guaranteed B2B review matrix position, detailed listing, and backlink authority.',
  },
  'enterprise-buyer': {
    name: 'Enterprise Procurement Intelligence',
    monthlyPriceInCents: 1900,
    yearlyPriceInCents: 1500 * 12,
    description: 'Unthrottled ROI calculative formula inputs and CSV matrix export permissions.',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, billingCycle, successUrl, cancelUrl } = body;

    const plan = PLAN_DETAILS[planId as keyof typeof PLAN_DETAILS];
    if (!plan) {
      return NextResponse.json({ error: 'Selected pricing plan is invalid.' }, { status: 400 });
    }

    const priceInCents = billingCycle === 'yearly' ? plan.yearlyPriceInCents : plan.monthlyPriceInCents;
    const amountInDollars = priceInCents / 100;

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    
    // Choose correct variant ID based on target plan
    let variantId = '';
    if (planId === 'founder-pro') {
      variantId = process.env.LEMON_SQUEEZY_VARIANT_FOUNDER_PRO || '';
    } else if (planId === 'enterprise-buyer') {
      variantId = process.env.LEMON_SQUEEZY_VARIANT_ENTERPRISE_BUYER || '';
    }

    const origin = req.headers.get('origin') || 'https://saasmatrix.co';
    const redirectSuccess = successUrl || `${origin}/subscribe/success?planId=${planId}&cycle=${billingCycle}`;
    const redirectCancel = cancelUrl || `${origin}/subscribe?cancel=true`;

    // Visual Sandbox Check: If Lemon Squeezy parameters are not fully configured, trigger emulated checkout
    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json({
        isSandbox: true,
        session: {
          id: `sim_ls_${Math.random().toString(36).substring(2, 15)}`,
          url: `/subscribe/sandbox-success?planId=${planId}&cycle=${billingCycle}&amount=${amountInDollars}`,
          amount_total: priceInCents,
          currency: 'usd',
          payment_status: 'unpaid',
        },
        message: 'Lemon Squeezy API Key or Store ID parameters are absent. Running visual sandbox emulation.',
      });
    }

    // JSON:API payload layout for Lemon Squeezy Checkout initialization
    const checkoutPayload = {
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            redirect_url: redirectSuccess,
          },
          checkout_options: {
            embed: false,
            button_color: '#2563eb', // Brand blue
          }
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId.trim(),
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId.trim(),
            },
          },
        },
      },
    };

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorDetail = data?.errors?.[0]?.detail || 'Unknown Lemon Squeezy API validation error';
      return NextResponse.json({ error: `Lemon Squeezy API error: ${errorDetail}` }, { status: response.status });
    }

    const checkoutUrl = data?.data?.attributes?.url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'Did not receive a checkout URL from Lemon Squeezy.' }, { status: 500 });
    }

    return NextResponse.json({
      isSandbox: false,
      session: {
        id: data.data.id,
        url: checkoutUrl,
      },
    });

  } catch (error: any) {
    console.error('Lemon Squeezy checkout gateway error:', error);
    return NextResponse.json(
      { error: 'Lemon Squeezy integration pipeline error: ' + (error.message || error) },
      { status: 500 }
    );
  }
}
