import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-check";

export async function GET(): Promise<NextResponse> {
  const auth = await isAuthenticated();

  if (!auth.authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
