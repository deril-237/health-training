import { getTraining, updateTraining } from "@/features/training/actions";
import { NextRequest, NextResponse } from "next/server";

export type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const result = await getTraining(id);

  return NextResponse.json(result, { status: result.statusCode });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await req.formData();
  const result = await updateTraining(id, data);

  return NextResponse.json(result, { status: result.statusCode });
}
