import { Book_shema } from "@/Shchema/books";
import { z } from "zod";

type BookData = z.infer<typeof Book_shema>;

export async function addBooks(Book: BookData) {
    try {
        const res = await fetch("/api/admin/add-books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Book),
        });

        const data = await res.json();


        if (!res.ok) {
            console.log(data.message);
            return;
        }

        console.log(data.message);
    } catch (error) {
        console.error(error);
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

        const data = await res.json();

        if (!res.ok) {
            console.log(data.message);
            return;
        }

        console.log(data.message);
    } catch (error) {
        console.error(error);
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
