import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=INR",
      {
        next: {
          revalidate: 60 * 60 * 12, // refresh twice per day
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    const rate = data?.rates?.INR;

    if (typeof rate !== "number") {
      throw new Error("Invalid exchange rate response");
    }

    return NextResponse.json({
      base: "EUR",
      target: "INR",
      rate,
      date: data.date,
    });
  } catch {
    return NextResponse.json(
      {
        base: "EUR",
        target: "INR",
        rate: null,
        date: null,
        error: "Exchange rate unavailable",
      },
      { status: 200 }
    );
  }
}