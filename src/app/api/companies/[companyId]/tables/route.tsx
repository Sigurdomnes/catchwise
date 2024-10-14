import { NextResponse } from 'next/server';
import { getCollection } from '../../../mongodb';
import { TableData } from '../../../data';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, {params}: {params: {companyId: string}}) {
    try {
        const companyId = params.companyId;

        if (!companyId) {
            return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
        }

        const collectionResponse = await getCollection("tables");

        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const tables = await collectionResponse.find({ companyId }).toArray();

        return NextResponse.json({ message: 'Tables retrieved successfully', tables }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving tables:', error);
        return NextResponse.json({ message: 'Error retrieving tables' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const tableData: TableData = await req.json();

        const collectionResponse = await getCollection("tables");

        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const result = await collectionResponse.insertOne(tableData);
        return NextResponse.json({ message: 'Table saved successfully', id: result. insertedId}, { status: 201 });

    } catch (error) {
        console.error('Error saving table:', error);
        return NextResponse.json({ message: 'Error saving table' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { companyId: string } }) {
    try {
        const companyId = params.companyId;

        if (!companyId) {
            return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
        }

        if (!ObjectId.isValid(companyId)) {
            return NextResponse.json({ message: 'Invalid Company ID' }, { status: 400 });
        }

        const collectionResponse = await getCollection("tables");

        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const result = await collectionResponse.deleteMany({ companyId: companyId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'No tables found for the given company ID' }, { status: 404 });
        }

        return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} tables for company ID: ${companyId}` }, { status: 200 });
    } catch (error) {
        console.error('Error deleting tables:', error);
        return NextResponse.json({ message: 'Error deleting tables' }, { status: 500 });
    }
}