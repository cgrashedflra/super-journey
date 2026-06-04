import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) throw new NotFoundError("User");

    try {
        await dbConnect();
        const user = await User.findById(id);
        if(!user) throw new NotFoundError("User");
        return NextResponse.json({success: true, data: user}, {status: 200});
    }catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

//delete
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) throw new NotFoundError("User");

    try {
        await dbConnect();
        const user = await User.findByIdAndDelete(id);
        if(!user) throw new NotFoundError("User");
        return NextResponse.json({success: true, message: "User deleted successfully"}, {status: 200});
    }catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

//put
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) throw new NotFoundError("User");

    try {
        await dbConnect();
        const body = await request.json();

        const validatedData = UserSchema.partial().parse(body);
        
        const updatedUser = await User.findByIdAndUpdate(id, validatedData, {new: true});
        if(!updatedUser) throw new NotFoundError("User");
        return NextResponse.json({success: true, data: updatedUser}, {status: 200});
    }catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}