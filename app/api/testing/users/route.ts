import { NextResponse } from "next/server";
import { createUserService, getUserByUsername } from "@/app/services/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, password } = body;

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: "Username, name, and password are required" },
        { status: 400 },
      );
    }

    const existing = await getUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 },
      );
    }

    const createdUser = await createUserService(username, name, password);
    return NextResponse.json(createdUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create user" },
      { status: 500 },
    );
  }
}
