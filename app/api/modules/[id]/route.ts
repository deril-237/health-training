import {
  updateModule,
  deleteModule,
  getModule,
} from "@/features/module/actions";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ trainingId: string; id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;

  const result = await getModule(id);

  return NextResponse.json(result, { status: result.statusCode });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const data = await req.json();

  const result = await updateModule(id, data);

  return NextResponse.json(result, { status: result.statusCode });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;

  const result = await deleteModule(id);

  return NextResponse.json(result, { status: result.statusCode });
}
