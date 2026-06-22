import { NextResponse } from "next/server";

type ContactPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  cityCountry?: string;
  enquiryType?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const fullName = body.fullName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const cityCountry = body.cityCountry?.trim();
    const enquiryType = body.enquiryType?.trim();
    const message = body.message?.trim();

    if (!fullName || !phone || !email || !enquiryType || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, message: "Google Sheets URL is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        submittedAt: new Date().toISOString(),
        fullName,
        phone,
        email,
        cityCountry,
        enquiryType,
        message,
        source: "CareRadar Website",
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Could not save enquiry.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}