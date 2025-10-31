"use client";

import { useRouter } from "next/navigation";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["Up to 1 mail account", "Basic logs", "Community support"],
    cta: "Choose Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/mo",
    features: ["Up to 3 mail accounts", "Priority logs & stats", "Email support"],
    cta: "Choose Pro",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited mail accounts", "Advanced analytics", "Dedicated support"],
    cta: "Contact Sales",
  },
];

export default function PricingPage() {
  const router = useRouter();

  const onSelect = (planId) => {
    // BACKEND/Checkout integration placeholder:
    // router.push(`/checkout?plan=${encodeURIComponent(planId)}`);

    // PLACEHOLDER: remove when integrating payments
    console.log("[PLACEHOLDER] Navigate to checkout for plan:", planId);
    alert(`Selected plan: ${planId}. Payment integration coming soon.`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 
          className="text-3xl font-semibold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Pricing
        </h1>
        <p className="opacity-80" style={{ color: 'var(--foreground)' }}>
          Pick a plan that fits your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                {plan.name}
              </h2>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{plan.price}</span>
                {plan.period && (
                  <span className="opacity-70" style={{ color: 'var(--foreground)' }}>{plan.period}</span>
                )}
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--background)' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelect(plan.id)}
              className="w-full px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              type="button"
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


