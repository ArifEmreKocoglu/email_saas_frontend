"use client";

import { useState, useEffect } from "react";
import { plans } from "@/lib/api";

export default function PricingPage() {
  const [planList, setPlanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await plans.list();
        setPlanList(data);
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectPlan = async (priceId) => {
    try {
      setCheckoutLoading(priceId);
      const res = await plans.checkout(priceId);
      if (res?.url) {
        window.location.href = res.url; // Stripe Checkout yönlendirmesi
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
          Pricing Plans
        </h1>
        <p className="opacity-80" style={{ color: "var(--foreground)" }}>
          Choose the plan that fits your needs. All plans include a 7-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {planList.map((plan) => (
          <div
            key={plan._id}
            className="rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                {plan.name}
              </h2>
              <div className="mt-2 flex items-end justify-center gap-1">
                <span className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                  ${plan.price}
                </span>
                <span className="opacity-70" style={{ color: "var(--foreground)" }}>
                  /month
                </span>
              </div>
            </div>

            <ul className="space-y-2 mb-6 text-sm">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center justify-center gap-2" style={{ color: "var(--foreground)" }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--background)" }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan.stripePriceId)}
              disabled={checkoutLoading === plan.stripePriceId}
              className="w-full px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
              type="button"
            >
              {checkoutLoading === plan.stripePriceId ? "Redirecting..." : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}