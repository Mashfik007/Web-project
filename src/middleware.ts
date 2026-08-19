import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("accessToken")?.value;

    // Define public paths
    const publicPaths = ['/', '/login', '/signup'];

    // User(token as string);

    // If on login/signup and has token -> redirect to profile
    if (publicPaths.includes(pathname) && token) {
        return NextResponse.redirect(new URL('/profile/:id', request.url));
    }

    // If NOT on login/signup and no token -> redirect to login
    if (!publicPaths.includes(pathname) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:id"
    ],
};