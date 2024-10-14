import { ObjectId } from 'mongodb';

export type Company = Document & {
  _id?: ObjectId;
  name: string;
  description: string;
  archived?: boolean;
};

export type Section = Document & {
  _id?: ObjectId;
  companyId: ObjectId;
  name: string;
  description: string;
  orderValue: number;
  sectionContent: SectionContent[];
};

export type SectionContent = {
  _id?: ObjectId;
  type: 'text' | 'table' | 'subsection';
  orderValue: number;
  rowValue?: number;
  textField?: string;
  tableData?: TableData;     
  subsection?: SubSection;
};

export type SubSection = {
  
  _id?: ObjectId;
  sectionContentID: ObjectId;
  name: string;
  content: SectionContent[];
  orderValue: number;
};

export type TableData = Document & {
  _id?: ObjectId;
  name: string;
  headers: string[];
  rows: string[][];
  orderValue?: number;
};