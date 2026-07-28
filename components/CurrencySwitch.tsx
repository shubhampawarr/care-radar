"use client";

import { useEffect, useState } from "react";
import { BadgeEuro, IndianRupee, RefreshCw } from "lucide-react";

export type Currency = "EUR" | "INR";

type CurrencySwitchProps = {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onRateChange: (rate: number | null) => void;
  locale: "en" | "de";
};

export default function CurrencySwitch({
  currency,
  onCurrencyChange,
  onRateChange,
  locale,
}: CurrencySwitchProps) {
  const [rate, setRate] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const text = {
    en: {
      label: "Display salary in",
      eur: "EUR",
      inr: "INR",
      loading: "Fetching latest EUR to INR rate",
      rate: "Live reference rate",
      unavailable:
        "INR conversion is temporarily unavailable. EUR values remain fixed.",
      note: "EUR figures are fixed. INR values are approximate and update with the exchange rate.",
    },
    de: {
      label: "Gehalt anzeigen in",
      eur: "EUR",
      inr: "INR",
      loading: "Aktueller EUR-INR-Kurs wird geladen",
      rate: "Aktueller Referenzkurs",
      unavailable:
        "INR-Umrechnung ist vorübergehend nicht verfügbar. EUR-Werte bleiben fest.",
      note: "EUR-Werte sind fest. INR-Werte sind Richtwerte und ändern sich mit dem Wechselkurs.",
    },
  } as const;

  const t = text[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadRate() {
      try {
        setIsLoading(true);

        const response = await fetch("/api/exchange-rate", {
          cache: "no-store",
        });

        const data = await response.json();
        const nextRate =
          typeof data?.rate === "number" ? Number(data.rate) : null;

        if (!isMounted) return;

        setRate(nextRate);
        setDate(typeof data?.date === "string" ? data.date : null);
        onRateChange(nextRate);
      } catch {
        if (!isMounted) return;

        setRate(null);
        setDate(null);
        onRateChange(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRate();

    return () => {
      isMounted = false;
    };
  }, [onRateChange]);

  return (
    <section className="bg-white px-5 pt-6 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_58%,#ecfffb_100%)] px-4 py-2 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#08a99d]">
            {t.label}
          </p>

          <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => onCurrencyChange("EUR")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currency === "EUR"
                  ? "bg-[#08264a] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#08264a]"
              }`}
            >
              <BadgeEuro size={13} />
              {t.eur}
            </button>

            <button
              type="button"
              onClick={() => onCurrencyChange("INR")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currency === "INR"
                  ? "bg-[#08a99d] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#08a99d]"
              }`}
            >
              <IndianRupee size={13} />
              {t.inr}
            </button>
          </div>

          <span className="hidden h-4 w-px bg-slate-200 sm:block" />

          {isLoading ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <RefreshCw size={13} className="animate-spin" />
              {t.loading}
            </span>
          ) : rate ? (
            <span className="text-xs font-semibold text-[#061f3d]">
              {t.rate}: €1 ≈ ₹
              {rate.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              {date && (
                <span className="ml-1.5 font-normal text-slate-400">
                  ({date})
                </span>
              )}
            </span>
          ) : (
            <span className="text-xs text-slate-500">{t.unavailable}</span>
          )}
        </div>

        <p className="text-center text-[11px] leading-5 text-slate-400">
          {t.note}
        </p>
      </div>
    </section>
  );
}