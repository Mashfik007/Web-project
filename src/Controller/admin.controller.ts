import { Book_shema } from "@/Shchema/books";
import { z } from "zod";

type BookData = z.infer<typeof Book_shema>;

type ServerResult = {
    ok: boolean;
    message: string;
};

async function readResult(res: Response): Promise<ServerResult> {
    try {
        const data = await res.json();
        return {
            ok: res.ok,
            message: data.message || (res.ok ? "Saved" : "Request failed"),
        };
    } catch {
        return {
            ok: false,
            message: "Could not read the server response.",
        };
    }
}

export async function addBooks(book: BookData, image: File) {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("book", JSON.stringify(book));
        // image added
        const res = await fetch("/api/admin/add-books", {
            method: "POST",
            body: formData,
        });

        return readResult(res);
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Could not reach the server." };
    }
}

export async function searchBooks(filters: {
    author?: string;
    category?: string;
    available?: string;
}) {
    try {
        const params = new URLSearchParams({
            author: filters.author?.trim() || "all",
            category: filters.category?.trim() || "all",
            available: filters.available?.trim() || "all",
        });

        const res = await fetch(`/api/admin/books?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
            console.log(data.message);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getBook(id: string) {
    try {
        const res = await fetch(`/api/admin/books/${id}`);
        const data = await res.json();

        if (!res.ok) {
            console.log(data.message);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateBook(id: string, book: BookData, image?: File) {
    try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("book", JSON.stringify(book));
        if (image && image.size > 0) {
            formData.append("image", image);
        }

        const res = await fetch("/api/admin/update-books", {
            method: "POST",
            body: formData,
        });

        return readResult(res);
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Could not reach the server." };
    }
}

export async function restoreBook(id: string) {
    try {
        const res = await fetch("/api/admin/restore-books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        return readResult(res);
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Could not reach the server." };
    }
}

export async function deleteBook(id: string) {
    try {
        const res = await fetch("/api/admin/delete-books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        return readResult(res);
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Could not reach the server." };
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
