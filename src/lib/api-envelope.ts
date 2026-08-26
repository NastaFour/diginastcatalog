import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

export function apiSuccess<T>(data: T, status = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}

export function apiError(error: string, code = "BAD_REQUEST", status = 400) {
  const body: ApiResponse = {
    success: false,
    error,
    code,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { status });
}
