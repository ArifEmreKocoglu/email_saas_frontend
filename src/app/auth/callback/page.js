"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const status = sp.get("status");
  const email = sp.get("email");
  const msg = sp.get("msg");

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => router.replace("/mail-accounts"), 1500);
      return () => clearTimeout(t);
    }
  }, [status, router]);

  if (status === "error") {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Bağlantı Hatası</h1>
        <p className="mt-2 text-red-600">{msg || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Hesap bağlandı</h1>
      <p className="mt-2">Gmail: <b>{email}</b></p>
      <p className="mt-4">Yönlendiriliyor...</p>
    </div>
  );
}