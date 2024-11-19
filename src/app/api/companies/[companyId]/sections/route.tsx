import { NextResponse } from 'next/server';
import { getCollection } from '../../../mongodb';
import { Section } from '../../../data';

export async function GET(req: Request, { params }: { params: { companyId: string } }) {
    try {
        const companyId = params.companyId;

        if (!companyId) {
            return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
        }

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }
        
        const sections = await collectionResponse.find({ companyId }).toArray();

        return NextResponse.json(sections, { status: 200 });
    } catch (error) {
        console.error('Error retrieving sections:', error);
        return NextResponse.json({ message: 'Error retrieving sections' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const sectionData: Section = await req.json();

        const collectionResponse = await getCollection('sections');

        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const result = await collectionResponse.insertOne(sectionData);
        return NextResponse.json(result.insertedId, { status: 201 });

    } catch (error) {
        console.error('Error saving section:', error);
        return NextResponse.json({ message: 'Error saving section' }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { companyId: string } }) {
    try {
        const companyId = params.companyId;

        if (!companyId) {
            return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
        }

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const result = await collectionResponse.deleteMany({ companyId: companyId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'No sections found to delete for the specified company' }, { status: 404 });
        }

        return NextResponse.json({ message: 'All sections deleted successfully', deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error('Error deleting sections:', error);
        return NextResponse.json({ message: 'Error deleting sections' }, { status: 500 });
    }
}
