import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";
import { AccountSchema } from "@/lib/validations";
import { flattenError } from "zod";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const account = await Account.findById(id);
        if(!account) throw new NotFoundError("Account");
        return NextResponse.json({success: true, data: account}, {status: 200});
    }catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

//delete
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const account = await Account.findByIdAndDelete(id);
        if(!account) throw new NotFoundError("Account");
        return NextResponse.json({success: true, message: "Account deleted successfully"}, {status: 200});
    }catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

//put
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = AccountSchema.partial().safeParse(body);

        if (!validatedData.success) {
              throw new ValidationError(flattenError(validatedData.error).fieldErrors);
            }
        
        const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {new: true});
        if(!updatedAccount) throw new NotFoundError("Account");
        return NextResponse.json({success: true, data: updatedAccount}, {status: 200});
    }catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}