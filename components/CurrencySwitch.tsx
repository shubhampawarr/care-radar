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
    <section className="bg-white px-5 pb-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_58%,#ecfffb_100%)] p-4 shadow-lg shadow-slate-100 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
                {t.label}
              </p>

              <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => onCurrencyChange("EUR")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    currency === "EUR"
                      ? "bg-[#08264a] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#08264a]"
                  }`}
                >
                  <BadgeEuro size={16} />
                  {t.eur}
                </button>

                <button
                  type="button"
                  onClick={() => onCurrencyChange("INR")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    currency === "INR"
                      ? "bg-[#08a99d] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#08a99d]"
                  }`}
                >
                  <IndianRupee size={16} />
                  {t.inr}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 md:min-w-[330px]">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <RefreshCw size={16} className="animate-spin" />
                  {t.loading}
                </div>
              ) : rate ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {t.rate}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#061f3d]">
                    €1 ≈ ₹
                    {rate.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  {date && (
                    <p className="mt-1 text-xs text-slate-500">
                      Updated: {date}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  {t.unavailable}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-500">{t.note}</p>
        </div>
      </div>
    </section>
  );
}