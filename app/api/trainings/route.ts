// app/api/formations/route.ts

import { createTraining, getTrainingList } from "@/features/training/actions";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const result = await getTrainingList({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });
  return NextResponse.json(result, { status: result.statusCode });
}

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const result = await createTraining(body);

  return NextResponse.json(result, { status: result.statusCode });
}
