import { NextResponse } from 'next/server';
import { getCollection } from '../../mongodb';
import { Company } from '../../data';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: { companyId: string } }) {
  try {
    const { description, organisasjonsnummer, archived } = await req.json();
    const id = params.companyId;
    console.log("id",id)

    if (description === undefined && archived === undefined && organisasjonsnummer === undefined) {
      return NextResponse.json(
        { message: 'Invalid request. Field(s) are required.' },
        { status: 400 }
      );
    }

    const collectionResponse = await getCollection<Company>("companies");
    if (collectionResponse instanceof NextResponse) return collectionResponse;

    if (description === undefined && archived !== undefined) {
      const result = await collectionResponse.updateOne(
        { _id: new ObjectId(id) },
        { $set: { archived: archived } }
      );

      if (result.modifiedCount === 0) {
        return NextResponse.json({ message: 'Company not found or archived status not updated.' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Company archived status updated successfully' }, { status: 200 });
    }

    const updateFields: Partial<Company> = {};
    if (organisasjonsnummer !== undefined) {
      updateFields.organisasjonsnummer = organisasjonsnummer;
    }
    if (description !== undefined) {
      updateFields.description = description;
    }
    if (archived !== undefined) {
      updateFields.archived = archived;
    }

    const result = await collectionResponse.updateOne(
      { _id: new ObjectId(id) },
      { $set: { description: description } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Company not found or field(s) not updated.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Company field(s) updated successfully' }, { status: 200 });
  } catch (e) {
    console.error('Error updating company description:', e);
    return NextResponse.json({ message: 'Error updating company field(s)' }, { status: 500 });
  }
}

export async function DELETE(req: Request, {params}: {params: {companyId: string}}) {
  try {
    const id = params.companyId;

    if (!id) {
      return NextResponse.json(
        { message: 'Invalid request. Company ID is required.' },
        { status: 400 }
      );
    }

    const collectionResponse = await getCollection<Company>("companies");
    if (collectionResponse instanceof NextResponse) return collectionResponse;

    const result = await collectionResponse.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Company not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Company deleted successfully' }, { status: 200 });
  } catch (e) {
    console.error('Error deleting company:', e);
    return NextResponse.json({ message: 'Error deleting company' }, { status: 500 });
  }
}