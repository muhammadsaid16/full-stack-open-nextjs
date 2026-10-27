"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/services/session";
import {
  createUserService,
  generateApiTokenForUser,
  getUserByUsername,
} from "@/app/services/users";

export type RegisterState = {
  error?: {
    field?: "username" | "passwordConfirm" | "general";
    message: string;
  };
  success?: boolean;
};

export async function registerUser(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const username = (formData.get("username") as string)?.trim() || "";
  const name = (formData.get("name") as string)?.trim() || "";
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  if (username.length < 4) {
    return {
      error: {
        field: "username",
        message: "Username must be at least 4 characters long",
      },
    };
  }

  if (password !== confirmPassword) {
    return {
      error: {
        field: "passwordConfirm",
        message: "Passwords do not match",
      },
    };
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return {
      error: {
        field: "username",
        message: "Username already taken",
      },
    };
  }

  try {
    await createUserService(username, name, password);
  } catch (err: any) {
    return {
      error: {
        field: "general",
        message: err.message || "Failed to register user",
      },
    };
  }

  redirect("/login");
}

export async function generateApiTokenAction(): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const token = await generateApiTokenForUser(currentUser.id);
    revalidatePath("/me");
    return { success: true, token };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate token" };
  }
}
