import { Form_shema } from "@/Shchema/users";
import { z } from "zod";

type FormData = z.infer<typeof Form_shema>;

export async function register_user(user: FormData) {
  try {
    const res = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

type loginForm = {
  email: string;
  password: string;
};

export async function login_user(form: loginForm) {
  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function request_password_reset(email: string) {
  try {
    const res = await fetch("/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function reset_password(form: {
  token: string;
  password: string;
  confirmpassword: string;
}) {
  try {
    const res = await fetch("/api/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function logout() {
  try {
    const res = await fetch("/api/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}
