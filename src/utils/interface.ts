export interface Company {
    _id?: string;
    name: string;
    description: string;
    archived?: boolean;
}

export interface Section {
    _id?: string;
    companyId: string;
    name: string;
    description: string;
    orderValue: number;
    sectionContent?: SectionContent[];
};

export type SectionContent = {
    _id?: string;
    type: 'text' | 'table' | 'subsection';
    orderValue: number;
    rowValue?: number;
    textField?: string;
    tableData?: TableData;
    subsection?: SubSection;
};

export type SubSection = {
    _id?: string;
    name: string;
    content: SectionContent[];
    orderValue: number;
};

export interface TableData {
    _id?: string;
    name: string;
    headers: string[];
    rows: string[][];
    orderValue?: number;
}