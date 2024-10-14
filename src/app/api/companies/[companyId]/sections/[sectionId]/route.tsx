import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { getCollection } from '../../../../mongodb';
import { Section, SectionContent } from '../../../../data';

export async function GET(req: Request, { params }: { params: { sectionId: string } }) {
    try {
        const sectionId = params.sectionId;

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const section = await collectionResponse.findOne({ _id: new ObjectId(sectionId) });

        if (!section) {
            return NextResponse.json({ message: 'Section not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Section retrieved successfully', section }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving section:', error);
        return NextResponse.json({ message: 'Error retrieving section' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { sectionId: string } }) {
    try {
        const sectionId = params.sectionId;
        const newContent: SectionContent = await req.json();

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        // Push new content into the sectionContent array
        const result = await collectionResponse.updateOne(
            { _id: new ObjectId(sectionId) },
            { $push: { sectionContent: { ...newContent, _id: new ObjectId() } } } // Add a new ObjectId to the content
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'Section not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Content added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding content to section:', error);
        return NextResponse.json({ message: 'Error adding content to section' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { sectionId: string } }) {
    try {
        const sectionId = params.sectionId;
        const { name, description, sectionContent }: Partial<Section> = await req.json();

        if (!sectionId) {
            return NextResponse.json({ message: 'Section ID is required' }, { status: 400 });
        }

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const section = await collectionResponse.findOne({ _id: new ObjectId(sectionId) }) as Section;
        if (!section) {
            return NextResponse.json({ message: 'Section not found' }, { status: 404 });
        }

        let updateFields: Partial<Section> = {};

        if (name) updateFields.name = name;
        if (description) updateFields.description = description;

        const existingContentLength = section.sectionContent ? section.sectionContent.length : 0;

        if (sectionContent) {
            const updates = sectionContent.map( async (content, index) => {
                if (content._id) {
                    if (content.type === 'table') {
                        return collectionResponse.updateOne(
                            { _id: new ObjectId(sectionId), 'sectionContent._id': content._id },
                            { $set: { 'sectionContent.$.tableData': content.tableData, 'sectionContent.$.orderValue': content.orderValue } }
                        );
                    } else if (content.type === 'text') {
                        return collectionResponse.updateOne(
                            { _id: new ObjectId(sectionId), 'sectionContent._id': content._id },
                            { $set: { 'sectionContent.$.textField': content.textField, 'sectionContent.$.orderValue': content.orderValue } }
                        );
                    } else if (content.type === 'subsection') {
                        return collectionResponse.updateOne(
                            { _id: new ObjectId(sectionId), 'sectionContent._id': content._id },
                            { $set: { 'sectionContent.$.subsection': content.subsection, 'sectionContent.$.orderValue': content.orderValue } }
                        );
                    }
                } else {
                    // Push new content into the sectionContent array
                    const newOrderValue = existingContentLength + index + 1;
                    return collectionResponse.updateOne(
                        { _id: new ObjectId(sectionId) },
                        { $push: { sectionContent: { ...content, orderValue: newOrderValue } } }
                    );
                }
            });

            await Promise.all(updates); // Perform updates for all section contents
        }

        // Update section fields
        if (name || description) {
            const result = await collectionResponse.updateOne(
                { _id: new ObjectId(sectionId) },
                { $set: updateFields }
            );

            if (result.modifiedCount === 0) {
                return NextResponse.json({ message: 'Section not found or no changes made' }, { status: 404 });
            }
        }

        return NextResponse.json({ message: 'Section updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json({ message: 'Error updating section' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { sectionId: string } }) {
    try {
        const sectionId = params.sectionId;
        const { contentId } = await req.json();

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        // Remove specific content from sectionContent array
        const result = await collectionResponse.updateOne(
            { _id: new ObjectId(sectionId) },
            { $pull: { sectionContent: { _id: new ObjectId(contentId) } } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'Section or content not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Content deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting content:', error);
        return NextResponse.json({ message: 'Error deleting content' }, { status: 500 });
    }
}