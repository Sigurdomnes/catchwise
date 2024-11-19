import { NextResponse } from 'next/server';
import { getCollection } from '../mongodb';
import { Company } from '../data';
import { OptionalId } from 'mongodb';

export async function GET() {
  try {
    const collectionResponse = await getCollection<Company>("companies");
    if (collectionResponse instanceof NextResponse ) return collectionResponse;
    const companies = await collectionResponse.find({}).toArray();

    if (!Array.isArray(companies)) {
      return NextResponse.json({ message: 'No companies found or data format is invalid' }, { status: 404 });
    }

    return NextResponse.json(companies, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Error retrieving companies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      console.log(req.body)
      return NextResponse.json({ message: 'Invalid request. Name is required.' }, { status: 400 });
    }

    const collectionResponse = await getCollection<Company>("companies");
    if (collectionResponse instanceof NextResponse ) return collectionResponse;

    const result = await collectionResponse.insertOne({
      name: name,
      description: description || '',
      archived: false,
      logoUrl: undefined
    } as OptionalId<Company>);

    return NextResponse.json({message: "Company submitted successfully", id: result.insertedId}, { status: 201 });
  } catch (e) {
    console.error("Error:", e)
    return NextResponse.json({ message: "Error insterting company" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const collectionResponse = await getCollection<Company>("companies");
    if (collectionResponse instanceof NextResponse ) return collectionResponse;

    const result = await collectionResponse.deleteMany({});

    return NextResponse.json({ message: 'All companies cleared successfully', result }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Error clearing companies' }, { status: 500 });
  }
}
