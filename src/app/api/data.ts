import { ObjectId } from 'mongodb';

export type Company = Document & {
  _id?: ObjectId;
  name: string;
  description: string;
  organisasjonsnummer: string;
  archived?: boolean;
  logoUrl?: string;
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
  textField?: TextField;
  tableData?: TableData;     
  subSection?: SubSection;
};

export type TextField = {
  _id?: ObjectId;
  text?: string;
  orderValue?: number;
}

export type SubSection = {
  _id?: ObjectId;
  name?: string;
  orderValue?: number;
  description?: string;
  content?: SectionContent[];
};

export type TableData = Document & {
  _id?: ObjectId;
  name: string;
  showHeaders?: boolean;
  headers: string[];
  rows: string[][];
};