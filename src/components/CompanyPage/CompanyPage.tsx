'use client'

import { RootState } from "@/redux/store";
import { Button } from '@mui/material';
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { useEffect, useState, useRef } from 'react';
import { Company, Section as SectionInterface, TableData } from '../../utils/interface'
import { useParams } from 'next/navigation'
import EditableTable from './SectionContent/EditableTable';
import EditableTextField from './SectionContent/EditableTextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faMinus } from '@fortawesome/free-solid-svg-icons'
import { BasicPie } from "../mui/PieChart";
import { setCompanies } from "../../redux/companies/companySlice";
import { useDispatch } from 'react-redux';
import { callApi } from "../../utils/api";


export default function CompanyPage() {
    const companies = useSelector((state: RootState) => state.company.companies);
    const companyId = useParams<{ id: string }>().id
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [showEditableTable, setShowEditableTable] = useState<Record<string, boolean>>({});
    const [sections, setSections] = useState<SectionInterface[]>([]);
    const [enableEdit, setEnableEdit] = useState<boolean>(true);
    const dispatch = useDispatch();

    const pdfContentRef = useRef<HTMLDivElement>(null);
    const html2pdf = require('html2pdf.js');

    const exportToPdf = () => {
        if (pdfContentRef.current) {
            setEnableEdit(false);
            const originalOverflow = pdfContentRef.current.style.overflow;
            pdfContentRef.current.style.overflow = 'visible';
            const options = {
                margin: 0,
                filename: 'exported-page.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            html2pdf().from(pdfContentRef.current).set(options).save().then(() => {
                if (pdfContentRef.current) {
                    pdfContentRef.current.style.overflow = originalOverflow;
                    setEnableEdit(true);
                }
            });
        }
    };

    useEffect(() => {
        if (companyId && companies.length > 0) {
            const company = companies.find((company) => company._id === companyId);
            if (company) {
                setCurrentCompany(company || null);
                fetchSectionsFromDatabase();
            }
        }
    }, [companyId, companies]);

    const fetchCompanies = () => {
        callApi<Company[]>('api/companies')
            .then((companies) => {
                dispatch(setCompanies(companies));
            }).catch((e: Error) => {
            console.log("Error fetching companies:", e)
        });
    }

    const fetchSectionsFromDatabase = async () => {
        try {
            const response = await fetch(`/api/companies/${companyId}/sections`);
            const data = await response.json();
            if (response.ok) {
                console.log('Fetched Sections:', data.sections);
                setSections(data.sections);
            } else {
                console.error('Error fetching sections:', data.message);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const handleAddSection = async () => {
        const newSection: SectionInterface = {
            companyId: companyId,
            name: '',
            description: '',
            orderValue: sections.length + 1
        };

        try {
            const response = await fetch(`/api/companies/${companyId}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSection),
            });

            if (response.ok) {
                const data = await response.json();
                setSections([...sections, { ...newSection, _id: data.id }]);
            } else {
                console.error('Failed to create new section');
            }
        } catch (error) {
            console.error('Error creating section:', error);
        }
    };

    const clearSections = async () => {
        try {
            const response = await fetch(`/api/companies/${companyId}/sections`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`${data.deletedCount} sections deleted`);
                fetchSectionsFromDatabase();
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error clearing sections:', error);
        }
    };

    const handleSaveTable = async (sectionId: string | undefined, tableData: TableData) => {
        try {
            const body = {
                tableData: tableData,
                type: 'table'
            }
            const response = await fetch(`/api/companies/${companyId}/sections/${sectionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                fetchSectionsFromDatabase();
                console.log(response.json())
            } else {
                alert('Error saving table.');
            }
        } catch (error) {
            console.error('Failed to save table:', error);
            alert('An error occurred while saving the table.');
        }
    };

    const handleAddTableClick = (sectionId: string) => {
        setShowEditableTable(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId] // Toggle the state for the specific section
        }));
    };

    const clearTables = async () => {
        try {
            const res = await fetch(`/api/companies/${companyId}/tables`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.status === 200) {
                console.log("Database cleared:", data);
                fetchSectionsFromDatabase();
            } else {
                console.error("Failed to clear companies:", data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Container>
            <PdfArea ref={pdfContentRef}>
                <H1>{currentCompany?.name || "Company Name"}</H1>
                <EditableTextField onSuccess={fetchCompanies} selectedCompany={currentCompany} id={companyId} text={currentCompany?.description} placeholder={"beskrivelse"} />
                {enableEdit && <SavePdfButton onClick={exportToPdf}>Export to PDF</SavePdfButton>}
                {/* Sections */}

                {sections
                    .sort((a, b) => a.orderValue - b.orderValue)
                    .map((section) => (
                        <Section key={section._id}>
                            <H2 style={{ display: 'flex' }}>{section.orderValue}:
                                <EditableTextField onSuccess={fetchSectionsFromDatabase} selectedCompany={currentCompany} section={section} id={section._id} text={section.name} placeholder={"overskrift"} />
                            </H2>

                            {/* Text area */}
                            {(section.sectionContent ?? [])
                                .sort((a, b) => a.orderValue - b.orderValue)
                                .map((content) => {
                                    if (content.type === 'text') {
                                        return (
                                            <EditableTextField
                                                key={content._id}
                                                selectedCompany={currentCompany}
                                                section={section}
                                                id={content._id?.toString()}
                                                text={content.textField}
                                            />
                                        );
                                    } else if (content.type === 'table') {
                                        const isTwoColumnTable = content.tableData?.headers.length === 2;
                                        return (
                                            <TableContainer>
                                                <Table key={content._id}>
                                                    <TableTitle>{content.tableData?.name}</TableTitle>
                                                    <thead>
                                                        <tr>
                                                            {content.tableData?.headers.map((header, index) => (
                                                                <TableHeaders key={index}>{header}</TableHeaders>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {content.tableData?.rows.map((row, rowIndex) => (
                                                            <tr key={rowIndex}>
                                                                {row.map((cell, cellIndex) => (
                                                                    <TableCells key={cellIndex}>{cell}</TableCells>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                {isTwoColumnTable ? (
                                                    // Render pie chart if the table has exactly two columns
                                                    <BasicPie tableData={content.tableData!} />
                                                ) : ("")}
                                                {/*<TableExpandButton><FontAwesomeIcon icon={faPlusCircle} /></TableExpandButton>*/}
                                            </TableContainer>
                                        )
                                    }
                                })
                            }
                            {/* Add table */}
                            {section._id?.toString() && enableEdit &&
                                <AddTableContainer>
                                    <AddTableButton onClick={() => handleAddTableClick(section._id!.toString())}>Legg til tabell</AddTableButton>
                                    {showEditableTable[section._id] && (
                                        <EditableTable sectionId={section._id} onSaveTable={handleSaveTable} />
                                    )}
                                </AddTableContainer>
                            }
                        </Section>
                    ))}
                {enableEdit &&
                    <>
                        <Button onClick={clearTables} style={{ position: 'absolute', bottom: '0', color: 'var(--cwcolor)' }}>
                            Clear tables
                        </Button>
                        <Button onClick={clearSections} style={{ position: 'absolute', bottom: '0', left: '45%', color: 'var(--cwcolor)' }}>
                            Clear sections
                        </Button>
                        <Button onClick={handleAddSection}>Add New Section</Button>
                    </>
                }
            </PdfArea>
        </Container>
    );
}

const Container = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    background: #fff;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    height: 100vh;
`

const PdfArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: auto;
    &::-webkit-scrollbar {
        width: .5rem;
        background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        height: 2rem;
        border-radius: 10px;
    }
`

const SavePdfButton = styled.button`
    position: absolute;
    right: 2rem;
    bottom: 1rem;
    background: #333;
    padding: 1rem 2rem;
    border-radius: 15px;
    cursor: pointer;
    &:hover {
        transform: scale(1.025)
    }
`

const H1 = styled.h1`
    padding: 1.5rem 0 0;
    letter-spacing: .2rem;
    font-size: 2.5rem;
`

const H2 = styled.h2`
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 1.3rem;
    margin-top: -2rem;
`

const Section = styled.section`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    text-align: center;
    border: 1px solid #ccc;
    padding: 2rem;
    width: 794px;
`

const AddTableContainer = styled.div`
`

const AddTableButton = styled.button`
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: var(--cwcolor);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #005bb5;
    }
`;

const TableContainer = styled.div`
    margin-top: 1rem;
    min-width: 30vw;
    align-self: center;
    display: flex;
    justify-content: center;
    position: relative
`;

const TableExpandButton = styled.div`
    right: 6rem;
    top: .2rem;
    font-size: 1.5rem;
    position: absolute;
    color: #999;
    cursor: pointer;
    transition: .2s ease;
    &:hover {
        color: darkgreen;
    }
`

const Table = styled.table`
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    overflow: hidden;
    border-collapse: collapse;
`;

const TableTitle = styled.caption`
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    padding: .5rem;
    background: var(--cwcolor);
    color: #fff;
    border-radius: 5px;
`;

const TableHeaders = styled.th`
    font-weight: 600;
    text-align: left;
    padding: .5rem 3rem .5rem 1.5rem;
    border: 1px solid #ccc;
    background: #ccc;
`

const TableCells = styled.td`
    font-size: 1rem;
    padding: .5rem 3rem .5rem 1.5rem;
    color: #333;
    text-align: left;
    border: 1px solid #ccc;
`;
