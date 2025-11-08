"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { plans } from "@/lib/api";

function SuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Plan doğrulanıyor...");

  useEffect(() => {
    async function verifySession() {
      try {
        if (!sessionId) return;
        const res = await plans.verify(sessionId);
        if (res.success) {
          setStatus("success");
          setMessage(`🎉 ${res.message}`);
          setTimeout(() => router.push("/dashboard"), 2500);
        } else {
          setStatus("error");
          setMessage("Plan doğrulama başarısız oldu.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Sunucuya bağlanırken hata oluştu.");
      }
    }
    verifySession();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {status === "loading" && <p className="text-lg">⏳ {message}</p>}
      {status === "success" && (
        <p className="text-green-600 font-semibold text-lg">{message}</p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold text-lg">{message}</p>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}>
      <SuccessInner />
    </Suspense>
  );
}