"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants ou mot de passe incorrect." }
        default:
          return { error: "Une erreur est survenue lors de l'authentification." }
      }
    }
    // Permet à Next.js de gérer la redirection (isRedirectError)
    throw error
  }
}
