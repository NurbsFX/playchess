import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, username, email, password, confirmPassword } = body;
        return NextResponse.json(body)
    }
    catch (error) {

    }
}