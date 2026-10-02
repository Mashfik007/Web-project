import { AdminUser_shema } from "@/Shchema/adminUsers";
import { Author_shema } from "@/Shchema/authors";
import { Book_shema } from "@/Shchema/books";
import { Category_shema } from "@/Shchema/categories";
import { DigitalResource_shema } from "@/Shchema/digitalResources";
import { Fine_shema } from "@/Shchema/fines";
import { Publisher_shema } from "@/Shchema/publishers";
import { z } from "zod";

type BookData = z.infer<typeof Book_shema>;
type CategoryData = z.infer<typeof Category_shema>;
type AuthorData = z.infer<typeof Author_shema>;
type PublisherData = z.infer<typeof Publisher_shema>;
type AdminUserData = z.infer<typeof AdminUser_shema>;
type FineData = z.infer<typeof Fine_shema>;
type DigitalResourceData = z.infer<typeof DigitalResource_shema>;

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

async function postCategory(url: string, body: unknown): Promise<ServerResult> {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return readResult(res);
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Could not reach the server." };
    }
}

export async function addCategory(category: CategoryData) {
    return postCategory("/api/admin/add-categories", category);
}

export async function updateCategory(id: string, category: CategoryData) {
    return postCategory("/api/admin/update-categories", { id, ...category });
}

export async function toggleCategory(id: string) {
    return postCategory("/api/admin/category-status", { id });
}

export async function deleteCategory(id: string) {
    return postCategory("/api/admin/delete-categories", { id });
}

export async function restoreCategory(id: string) {
    return postCategory("/api/admin/restore-categories", { id });
}

export async function addAuthor(author: AuthorData) {
    return postCategory("/api/admin/add-authors", author);
}

export async function updateAuthor(id: string, author: AuthorData) {
    return postCategory("/api/admin/update-authors", { id, ...author });
}

export async function toggleAuthor(id: string) {
    return postCategory("/api/admin/author-status", { id });
}

export async function deleteAuthor(id: string) {
    return postCategory("/api/admin/delete-authors", { id });
}

export async function restoreAuthor(id: string) {
    return postCategory("/api/admin/restore-authors", { id });
}

export async function addPublisher(publisher: PublisherData) {
    return postCategory("/api/admin/add-publishers", publisher);
}

export async function updatePublisher(id: string, publisher: PublisherData) {
    return postCategory("/api/admin/update-publishers", { id, ...publisher });
}

export async function togglePublisher(id: string) {
    return postCategory("/api/admin/publisher-status", { id });
}

export async function deletePublisher(id: string) {
    return postCategory("/api/admin/delete-publishers", { id });
}

export async function restorePublisher(id: string) {
    return postCategory("/api/admin/restore-publishers", { id });
}

export async function addUser(user: AdminUserData) {
    return postCategory("/api/admin/add-users", user);
}

export async function updateUser(id: string, user: AdminUserData) {
    return postCategory("/api/admin/update-users", { id, ...user });
}

export async function toggleUser(id: string) {
    return postCategory("/api/admin/user-status", { id });
}

export async function deleteUser(id: string) {
    return postCategory("/api/admin/delete-users", { id });
}

export async function restoreUser(id: string) {
    return postCategory("/api/admin/restore-users", { id });
}

export async function decideBorrowRequest(
    id: string,
    action: "approve" | "reject",
    reason?: string,
) {
    return postCategory("/api/admin/borrow-request-status", { id, action, reason });
}

export async function markReturned(id: string, returnDate: string) {
    return postCategory("/api/admin/mark-returned", { id, returnDate });
}

export async function notifyReservation(id: string) {
    return postCategory("/api/admin/notify-reservation", { id });
}

export async function cancelReservation(id: string) {
    return postCategory("/api/admin/cancel-reservation", { id });
}

export async function addFine(fine: FineData) {
    return postCategory("/api/admin/add-fines", fine);
}

export async function payFine(id: string) {
    return postCategory("/api/admin/pay-fine", { id });
}

export async function waiveFine(id: string) {
    return postCategory("/api/admin/waive-fine", { id });
}

export async function addCommunityGroup(group: { name: string; description: string }) {
    return postCategory("/api/admin/add-community-groups", group);
}

export async function updateCommunityGroup(
    id: string,
    group: { name: string; description: string },
) {
    return postCategory("/api/admin/update-community-groups", { id, ...group });
}

export async function deleteCommunityGroup(id: string) {
    return postCategory("/api/admin/delete-community-groups", { id });
}

export async function sendNotification(notice: { title: string; message: string }) {
    return postCategory("/api/admin/send-notification", notice);
}

export async function addDigitalResource(
    resource: DigitalResourceData,
    file: File,
) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("resource", JSON.stringify(resource));

        const res = await fetch("/api/admin/add-digital-resource", {
            method: "POST",
            body: formData,
        });

        return readResult(res);
    } catch (error) {
        console.error(error);
        return { ok: false, message: "Could not reach the server." };
    }
}

export async function deleteDigitalResource(id: string) {
    return postCategory("/api/admin/delete-digital-resource", { id });
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
