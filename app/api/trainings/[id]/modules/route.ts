import { createModule, getModulesByTraining } from "@/features/module/actions";
import { NextResponse, NextRequest } from "next/server";
import type { Params } from "../route";

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  console.log(searchParams);
  const result = await getModulesByTraining(id, {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  return NextResponse.json(result, { status: result.statusCode });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const result = await createModule({ ...body, trainingId: id });

  return NextResponse.json(result, { status: result.statusCode });
}
