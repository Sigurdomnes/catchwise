import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {getCollection} from "@/app/api/mongodb";
import {Company} from "@/app/api/data";
import {ObjectId} from "mongodb";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads/logos");

export const POST = async (req: NextRequest, { params }: { params: { companyId: string } }) => {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as Blob) || null;

    if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR);
        }

        fs.writeFileSync(
            path.resolve(UPLOAD_DIR, (body.file as File).name),
            buffer
        );
    } else {
        return NextResponse.json({
            success: false,
        });
    }

    const companyId = params.companyId;

    const logoUrl = `/uploads/logos/${(body.file as File).name}`;

    const collectionResponse = await getCollection<Company>("companies");
    if (collectionResponse instanceof NextResponse ) return collectionResponse;
    const result = await collectionResponse.updateOne(
        { _id: new ObjectId(companyId) },
        { $set: { logoUrl: logoUrl } }
    );

    if (result.modifiedCount === 0) {
        return NextResponse.json({ success: false, message: "Failed to update company logo URL" }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        name: (body.file as File).name,
    });
};