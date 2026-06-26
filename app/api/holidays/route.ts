import { NextResponse } from "next/server";

type HolidayApiItem = {
  date?: string;
  description?: string;
  name?: string;
};

type HolidayApiResponse =
  | HolidayApiItem[]
  | {
      data?: HolidayApiItem[];
    };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentYear = new Date().getFullYear();
  const year = Number(searchParams.get("year")) || currentYear;

  try {
    const response = await fetch(
      `https://api-hari-libur.vercel.app/api?year=${year}`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data hari libur");
    }

    const payload = (await response.json()) as HolidayApiResponse;
    const items = Array.isArray(payload) ? payload : payload.data ?? [];

    const holidays = items
      .filter((item) => item.date)
      .map((item) => ({
        date: item.date as string,
        name: item.description || item.name || "Hari libur nasional",
      }));

    return NextResponse.json({
      success: true,
      data: holidays,
    });
  } catch (error) {
    console.error("GET HOLIDAYS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Gagal mengambil data hari libur",
      },
      {
        status: 500,
      }
    );
  }
}
