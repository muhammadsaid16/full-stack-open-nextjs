import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/services/session";
import { generateApiTokenForUser } from "@/app/services/users";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await generateApiTokenForUser(user.id);
    return NextResponse.json({ token }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate token" },
      { status: 500 },
    );
  }
}
