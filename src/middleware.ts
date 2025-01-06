import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ":").split(":");

export const middleware = (req: NextRequest) => {

    if (!isAuthenticated(req)) {
        return new NextResponse("Authentication required", {
            status: 401,
            headers: { "WWW-Authenticate": "Basic" },
        });
    }

    return NextResponse.next();
}

const isAuthenticated = (req: NextRequest) => {
    const authheader = req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authheader) {
        return false;
    }

    const authParts = authheader.split(" ")[1];
    if (!authParts) {
        return false;
    }

    const auth = Buffer.from(authParts, "base64").toString().split(":");

    if (auth[0] == AUTH_USER && auth[1] == AUTH_PASS) {
        return true;
    }
    return false;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};