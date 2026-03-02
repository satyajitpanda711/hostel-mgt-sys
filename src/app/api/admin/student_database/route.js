import Student from "@/models/UserModels/Student";
import Admin from "@/models/UserModels/Admin";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import jwt from "jsonwebtoken";
import Room from "@/models/Functions/Room";

export const GET = async (req, res) => {
    try {
        await connectDb();
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No cookie found.' }),
                { status: 401 }
            );
        }


        // Extract the token from the cookie
        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        console.log('Token:', token);
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'token_not_found' }),
                { status: 401 }
            );
        }

        const students = await Student.find()
            .select("-password")
            .populate({
                path: "room",
                select: "roomNumber hostelBlock",
            })
            .lean();

        if (!students.length) {
            return NextResponse.json(
                { success: false, message: "No students found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Students found.",
                students,
            },
            { status: 200 }
        );
    }
    catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Error fetching students.' }),
            { status: 500 }
        );
    }
}

