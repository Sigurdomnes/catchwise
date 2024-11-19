export interface Company {
    _id?: string;
    name: string;
    description: string;
    organisasjonsnummer: string;
    archived?: boolean;
    logoUrl?: string;
}

export interface Section {
    _id?: string;
    companyId: string;
    name: string;
    description: string;
    orderValue: number;
    sectionContent?: SectionContent[];
}

export type SectionContent = {
    _id?: string;
    type: 'text' | 'table' | 'subsection';
    orderValue: number;
    rowValue?: number;
    textField?: TextField;
    tableData?: TableData;
    subSection?: SubSection;
}

export type TextField = {
    _id?: string;
    text: string;
    orderValue?: number;
}

export type SubSection = {
    _id?: string;
    name?: string;
    content?: SectionContent[];
    orderValue?: number;
}

export interface TableData {
    _id?: string;
    name: string;
    showHeaders?: boolean;
    headers: string[];
    rows: string[][];
    orderValue?: number;
}