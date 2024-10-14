'use client'

import { RootState } from "@/redux/store";
import { Button } from '@mui/material';
import { useSelector } from "react-redux";
import { keyframes, styled } from "styled-components";
import { useEffect, useState } from 'react';
import { Company, Section as SectionInterface, TableData } from '../../utils/interface'
import { useParams } from 'next/navigation'
import EditableTable from '../EditableTable/EditableTable';
import EditableTextField from '../EditableTable/EditableTextField';
import BasicPie from "../mui/PieChart";


export default function CompanyPage() {
    const companies = useSelector((state: RootState) => state.company.companies);
    const companyId = useParams<{ id: string }>().id
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [showEditableTable, setShowEditableTable] = useState<Record<string, boolean>>({});
    const [tables, setTables] = useState<TableData[]>([]);
    const [sections, setSections] = useState<SectionInterface[]>([]);
    const [isEditingSection, setIsEditingSection] = useState<Record<string, boolean>>({});
    const [newSectionName, setNewSectionName] = useState<string>('');


    useEffect(() => {
        if (companyId && companies.length > 0) {
            const company = companies.find((company) => company._id === companyId);
            if (company) {
                setSelectedCompany(company || null);
                fetchSectionsFromDatabase();
            }
        }
    }, [companyId, companies]);

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

    const handleSectionNameChange = (sectionId: string, newName: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section._id === sectionId ? { ...section, name: newName } : section
            )
        );
    };

    // Function to handle section description change
    const handleSectionDescriptionChange = (sectionId: string, newDescription: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section._id === sectionId ? { ...section, description: newDescription } : section
            )
        );
    };

    // Save section details (send to backend or handle state update)
    const handleSaveSection = (sectionId: string) => {
        // Here you can send the section data to the backend for saving
        setIsEditingSection({ ...isEditingSection, [sectionId]: false }); // Disable editing for this section
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
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 2000);
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
            <H1>{selectedCompany?.name || "Company Name"}</H1>
            <EditableTextField selectedCompany={selectedCompany} id={companyId} text={selectedCompany?.description} placeholder={"overskrift"} />

            {/* Sections */}

            {sections
                .sort((a, b) => a.orderValue - b.orderValue)
                .map((section) => (
                    <Section key={section._id}>
                        <H2 style={{ display: 'flex' }}>{section.orderValue}:
                            <EditableTextField onSuccess={fetchSectionsFromDatabase} selectedCompany={selectedCompany} section={section} id={section._id} text={section.name} placeholder={"overskrift"} />
                        </H2>
                        <div>
                        </div>

                        {/* Text area */}

                        {(section.sectionContent ?? [])
                            .sort((a, b) => a.orderValue - b.orderValue)
                            .map((content) => {
                                if (content.type === 'text') {
                                    return (
                                        <EditableTextField
                                            key={content._id}
                                            selectedCompany={selectedCompany}
                                            section={section}
                                            id={content._id?.toString()}
                                            text={content.textField}
                                        />
                                    );
                                } else if (content.type === 'table') {
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
                                        </TableContainer>
                                    )
                                }
                            })
                        }
                        {/* Add table */}
                        {section._id?.toString() &&
                            <>
                                <AddTableButton onClick={() => handleAddTableClick(section._id!.toString())}>Legg til ny tabell</AddTableButton>
                                {showEditableTable[section._id] && (
                                    <EditableTable sectionId={section._id} onSaveTable={handleSaveTable} />
                                )}
                            </>
                        }
                    </Section>
                ))}
            <Button onClick={clearTables} style={{ position: 'absolute', bottom: '0', color: 'var(--cwcolor)' }}>
                Clear tables
            </Button>
            <Button onClick={clearSections} style={{ position: 'absolute', bottom: '0', left: '45%', color: 'var(--cwcolor)' }}>
                Clear sections
            </Button>
            <Button onClick={handleAddSection}>Add New Section</Button>
        </Container>
    );
}

const Container = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 1.5rem;
    background: #fff;
    height: calc(100vh - 3rem);
    overflow: scroll;
`

const H1 = styled.h1`
    font-family: BebasNeue;
    letter-spacing: .5rem;
    font-size: 3rem;
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
    min-width: 20vw;
    margin-bottom: 1rem;
    text-align: center;
    border: 1px solid #ccc;
    padding: 2rem;
`

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

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
`;

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