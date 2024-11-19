import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCollection } from "@/app/api/mongodb";
import {Section, SectionContent, SubSection, TableData, TextField} from "@/app/api/data";

type UpdateFields = {
    'sectionContent.$.textField'?: TextField;
    'sectionContent.$.textField.text'?: string;
    'sectionContent.$.textField.orderValue'?: number;
    'sectionContent.$.tableData'?: TableData;
    'sectionContent.$.subSection'?: SubSection;
    'sectionContent.$.subSection.name'?: string;
    'sectionContent.$.subSection.description'?: string;
    'sectionContent.$.subSection.content'?: SectionContent;
    'sectionContent.$.subSection.orderValue'?: number;
    'sectionContent.$.orderValue'?: number;
};

export async function PUT(req: Request, { params }: { params: { sectionId: string, contentId: string } }) {
    try {
        const sectionId = params.sectionId;
        const contentId = params.contentId;

        if (!sectionId || !contentId) {
            return NextResponse.json({ message: 'Section ID and Content ID are required' }, { status: 400 });
        }

        const collectionResponse = await getCollection('sections');
        if (collectionResponse instanceof NextResponse) {
            return collectionResponse;
        }

        const section = await collectionResponse.findOne({ _id: new ObjectId(sectionId) }) as Section;
        if (!section) {
            return NextResponse.json({ message: 'Section not found' }, { status: 404 });
        }

        const contentToUpdate = section.sectionContent?.find(content => content._id?.toString() === contentId);
        if (!contentToUpdate) {
            return NextResponse.json({ message: 'Content not found in the section' }, { status: 404 });
        }

        const updateFields: UpdateFields = {};
        const body = await req.json();

        if (contentToUpdate.type === 'table') {
            if (body.tableData) updateFields['sectionContent.$.tableData'] = body.tableData;
        } else if (contentToUpdate.type === 'text') {
            if (body.textField.text) updateFields['sectionContent.$.textField.text'] = body.textField.text;
            if (typeof body.textField.orderValue === 'number') updateFields['sectionContent.$.textField.orderValue'] = body.textField.orderValue;
        } else if (contentToUpdate.type === 'subsection') {
            if (body.subSection.name) updateFields['sectionContent.$.subSection.name'] = body.subSection.name;
            if (body.subSection.description) updateFields['sectionContent.$.subSection.description'] = body.subSection.description;
            if (body.subSection.content) updateFields['sectionContent.$.subSection.content'] = body.subSection.content;
            if (typeof body.subSection.orderValue === 'number') updateFields['sectionContent.$.subSection.orderValue'] = body.subSection.orderValue;

        }

        if (body.orderValue) updateFields['sectionContent.$.orderValue'] = body.orderValue;

        const result = await collectionResponse.updateOne(
            { _id: new ObjectId(sectionId), 'sectionContent._id': new ObjectId(contentId) },
            { $set: updateFields }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'Content update failed or no changes made' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Content updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating section content:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
