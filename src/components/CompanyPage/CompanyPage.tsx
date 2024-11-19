'use client'

import {RootState} from "@/redux/store";
import {Button} from '@mui/material';
import {useSelector} from "react-redux";
import {styled} from "styled-components";
import {useEffect, useState, useRef, useCallback} from 'react';
import {Company, Section as SectionInterface, SubSection, TableData} from '../../utils/interface'
import {useParams} from 'next/navigation'
import TableModal from './SectionContent/TableModal';
import EditableTextField from './SectionContent/EditableTextField';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlusCircle, faMinus } from '@fortawesome/free-solid-svg-icons'
import {BasicPie} from "../mui/PieChart";
import {callApi} from "@/utils/api";
import FrontPage from "@/components/CompanyPage/FrontPage/FrontPage";

type TableState = {
    tableData: TableData | null,
    contentId: string | undefined
}

export default function CompanyPage() {
    const companies = useSelector((state: RootState) => state.company.companies);
    const companyId = useParams<{ id: string }>().id
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [showTableModal, setShowTableModal] = useState<Record<string, boolean>>({});
    const [tableDataToEdit, setTableDataToEdit] = useState<TableState>({tableData: null, contentId: undefined});
    const [sections, setSections] = useState<SectionInterface[]>([]);
    const [enableEdit, setEnableEdit] = useState<boolean>(true);
    const [selectedOrder, setSelectedOrder] = useState<{
        sectionId: string;
        contentId: string | null;
        orderValue: number | null
    }>({
        sectionId: '',
        contentId: null,
        orderValue: null,
    });

    // import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
    //
    // const PdfDocument = () => (
    //     <Document>
    //         <Page>
    //             <Text>This is an exported PDF page.</Text>
    //         </Page>
    //     </Document>
    // );
    //
    // const exportToPdf = () => (
    //     <PDFDownloadLink document={<PdfDocument />} fileName="exported-page.pdf">
    //         {({ loading }) => (loading ? 'Loading...' : 'Download PDF')}
    //     </PDFDownloadLink>
    // );

    const pdfContentRef = useRef<HTMLDivElement>(null);

    const exportToPdf = async () => {
        if (pdfContentRef.current) {
            setEnableEdit(false);
            const originalOverflow = pdfContentRef.current.style.overflow;
            pdfContentRef.current.style.overflow = 'visible';
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const html2pdf = (await import('html2pdf.js')).default;
            const options = {
                margin: 0,
                filename: 'exported-page.pdf',
                image: {type: 'jpeg', quality: 1.0},
                html2canvas: {scale: 3, useCORS: true},
                jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
            };

            html2pdf().from(pdfContentRef.current).set(options).save().then(() => {
                if (pdfContentRef.current) {
                    pdfContentRef.current.style.overflow = originalOverflow;
                    setEnableEdit(true);
                }
            });
        }
    };

    const fetchSectionsFromDatabase = useCallback(() => {
        callApi<SectionInterface[]>(`/api/companies/${companyId}/sections`)
            .then((sections) => {
                console.log(sections);
                setSections(sections);
            }).catch((e: Error) => {
            console.log("Error fetching companies:", e)
        });
    }, [companyId, setSections])

    useEffect(() => {
        if (companyId && companies.length > 0) {
            const company = companies.find((company) => company._id === companyId);
            if (company) {
                setCurrentCompany(company || null);
                fetchSectionsFromDatabase();
            }
        }
    }, [companyId, companies, fetchSectionsFromDatabase]);

    const addSectionToDatabase = () => {
        const body: SectionInterface = {
            companyId: companyId,
            name: '',
            description: '',
            orderValue: sections.length + 1
        };
        callApi<string>(`/api/companies/${companyId}/sections`, 'POST', body)
            .then((id) => {
                setSections([...sections, {...body, _id: id}]);
            }).catch((e: Error) => {
            console.log("Error fetching companies:", e)
        });
    }

    const clearSectionsFromDatabase = () => {
        callApi<void>(`/api/companies/${companyId}/sections`, 'DELETE')
            .then(() => {
                fetchSectionsFromDatabase();
            }).catch((e: Error) => {
            console.log("Error fetching companies:", e)
        });
    }

    const addSectionContentToDatabase = (sectionId: string, data: TableData | SubSection | string, type: string) => {
        const section = sections.find(sec => sec._id === sectionId);
        const contentCount = section?.sectionContent?.length || 0;
        let body: object | undefined = undefined;
        if (type === "table") {
            body = {
                tableData: data,
                type: type,
                orderValue: contentCount + 1
            }
            setShowTableModal(prevState => ({
                ...prevState,
                [sectionId]: !prevState[sectionId]
            }));
        } else if (type === "subsection") {
            const subSectionCount = section?.sectionContent?.filter(content => content.type === "subsection").length || 0
            body = {
                type: type,
                orderValue: contentCount + 1,
                subSection: {
                    orderValue: subSectionCount + 1
                }
            };
        } else if (type === "text") {
            body = {
                textField: data,
                type: type,
                orderValue: contentCount + 1
            }
        }

        callApi<void>(`/api/companies/${companyId}/sections/${sectionId}`, 'POST', body)
            .then(() => {
                fetchSectionsFromDatabase();
            }).catch((e: Error) => {
            console.log("Error fetching companies:", e)
        });
    }

    const handleEditTableClick = (sectionId: string, tableData?: TableData, contentId?: string) => {
        setShowTableModal(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId]
        }));
        if (tableData) setTableDataToEdit({tableData, contentId});
        else if (showTableModal) setTableDataToEdit({tableData: null, contentId: undefined})

    };

    const handleOrderClick = (sectionId: string, contentId: string, currentOrder: number) => {
        setSelectedOrder({sectionId, contentId, orderValue: currentOrder});
    };

    // Updating order and rearranging other items
    const handleOrderChange = (newOrder: number) => {
        const updatedSections = sections.map(section => {
            if (section._id === selectedOrder.sectionId) {
                const updatedContent = section.sectionContent?.map(content => {
                    // Reorder content based on new order
                    if (content._id === selectedOrder.contentId) {
                        return {...content, orderValue: newOrder};
                    } else if (content.orderValue >= newOrder && content.orderValue < selectedOrder.orderValue!) {
                        return {...content, orderValue: content.orderValue + 1};
                    } else if (content.orderValue <= newOrder && content.orderValue > selectedOrder.orderValue!) {
                        return {...content, orderValue: content.orderValue - 1};
                    }
                    return content;
                });
                return {...section, sectionContent: updatedContent?.sort((a, b) => a.orderValue - b.orderValue)};
            }
            return section;
        });

        setSections(updatedSections);
        setSelectedOrder({sectionId: '', contentId: null, orderValue: null});

        // Call API to save updated order
        updatedSections.forEach(section => {
            section.sectionContent?.forEach(content => {
                callApi<void>(`/api/companies/${companyId}/sections/${section._id}/content/${content._id}`, 'PUT', {orderValue: content.orderValue})
                    .catch((e: Error) => {
                        console.error('Failed to update text:', e);
                    });
            });
        });
    };


    return (
        <Container>
            <PdfArea ref={pdfContentRef}>
                <FrontPage currentCompany={currentCompany}/>
                {enableEdit && <SavePdfButton onClick={exportToPdf}>Export to PDF</SavePdfButton>}
                {/* Sections */}
                {sections
                    .sort((a, b) => a.orderValue - b.orderValue)
                    .map((section) => (
                        <Section key={section._id}>
                            <H2 style={{display: 'flex'}}>
                                {selectedOrder.contentId === section._id ? (
                                    <input
                                        type="number"
                                        value={selectedOrder.orderValue || ""}
                                        onChange={e => handleOrderChange(Number(e.target.value))}
                                    />
                                ) : (
                                    <span
                                        onClick={() => handleOrderClick(section._id!, section._id!, section.orderValue)}>
                                        {section.orderValue}.
                                    </span>
                                )}
                                <EditableTextField onSuccess={fetchSectionsFromDatabase}
                                                   selectedCompany={currentCompany} section={section} id={section._id}
                                                   text={section.name} placeholder={"overskrift"}/>
                            </H2>
                            {/* Display section content */}
                            {(section.sectionContent ?? [])
                                .sort((a, b) => a.orderValue - b.orderValue)
                                .map((content) => {
                                    if (content.type === "subsection" && content.subSection) {
                                        return (
                                            <H3 key={content._id} style={{display: 'flex'}}>
                                                {selectedOrder.contentId === content._id ? (
                                                    <input
                                                        type="number"
                                                        value={selectedOrder.orderValue || ""}
                                                        onChange={e => handleOrderChange(Number(e.target.value))}
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={() => handleOrderClick(section._id!, content._id!, content.orderValue)}>
                                                    {section.orderValue}.{content.subSection.orderValue}.
                                                </span>
                                                )}
                                                <EditableTextField onSuccess={fetchSectionsFromDatabase}
                                                                   selectedCompany={currentCompany} section={section}
                                                                   sectionContent={content} id={content.subSection?._id}
                                                                   text={content.subSection?.name}
                                                                   placeholder={"overskrift"}/>
                                            </H3>
                                        );
                                    } else if (content.type === 'text') {
                                        return (
                                            <EditableTextField
                                                key={content._id}
                                                id={content._id}
                                                onSuccess={fetchSectionsFromDatabase}
                                                selectedCompany={currentCompany}
                                                section={section}
                                                sectionContent={content}
                                                text={content.textField?.text}
                                            />
                                        );
                                    } else if (content.type === 'table') {
                                        const isTwoColumnTable = content.tableData?.headers.length === 2;
                                        return (
                                            <TableContainer
                                                key={content._id}
                                                onClick={() => handleEditTableClick(section._id!, content.tableData!, content._id)}
                                            >
                                                <Table>
                                                    <TableTitle>{content.tableData?.name}</TableTitle>
                                                    {content.tableData?.showHeaders === undefined || content.tableData?.showHeaders &&
                                                        <thead>
                                                        <tr>
                                                            {content.tableData?.headers.map((header, index) => (
                                                                <TableHeaders key={index}>{header}</TableHeaders>
                                                            ))}
                                                        </tr>
                                                        </thead>
                                                    }
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
                                                    <BasicPie tableData={content.tableData!}/>
                                                ) : ("")}
                                                {/*<TableExpandButton><FontAwesomeIcon icon={faPlusCircle} /></TableExpandButton>*/}
                                            </TableContainer>
                                        )
                                    }
                                })
                            }
                            {/* Add section content */}
                            {section._id?.toString() && enableEdit &&
                                <>
                                    <AddContentContainer>
                                        <AddContentButton onClick={() => handleEditTableClick(section._id!)}>Legg til
                                            tabell</AddContentButton>
                                        <AddContentButton
                                            onClick={() => addSectionContentToDatabase(section._id!, {}, "text")}>Legg
                                            til fritekst</AddContentButton>
                                        <AddContentButton
                                            onClick={() => addSectionContentToDatabase(section._id!, {}, "subsection")}>Ny
                                            underkategori</AddContentButton>
                                        {showTableModal[section._id] && (
                                            <TableModal
                                                overlayClick={() => handleEditTableClick(section._id!)}
                                                sectionId={section._id}
                                                tableData={tableDataToEdit.tableData}
                                                onAddTable={addSectionContentToDatabase}
                                                companyId={currentCompany?._id}
                                                contentId={tableDataToEdit.contentId}
                                                onSuccess={fetchSectionsFromDatabase}
                                            />
                                        )}
                                    </AddContentContainer>
                                </>
                            }
                        </Section>
                    ))}
                {enableEdit &&
                    <>
                        <AddSectionButton onClick={addSectionToDatabase}>Legg til ny kategori</AddSectionButton>
                        <Button onClick={clearSectionsFromDatabase}
                                style={{position: 'absolute', bottom: '0', left: '45%', color: 'var(--cwcolor)'}}>
                            Clear sections
                        </Button>
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
    width: 100%;
    margin: 0 auto;
    padding: 1rem 0;
    overflow: hidden;
    height: 100vh;
    background: #eee;
`

const PdfArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 3rem;
    width: 794px;
    height: auto;
    background: #fff;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
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

const H2 = styled.h2`
    display: flex;
    align-items: center;
    justify-content: start;
    margin-top: -1rem;
    font-size: 1.3rem;
`

const H3 = styled.h3`
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 1rem;

`

const Section = styled.section`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    text-align: center;
    border: 1px solid #ccc;
    padding: 2rem;
    width: 100%;
`

const AddContentContainer = styled.div`
`

const AddSectionButton = styled.button`
    margin: 0 .5rem 5rem;
    padding: .5rem 1rem;
    background-color: var(--cwcolor);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #005bb5;
    }

`

const AddContentButton = styled.button`
    margin: 1rem .5rem;
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
    min-width: 35vw;
    align-self: center;
    display: flex;
    padding: 1rem 1rem 0 1rem;
    margin-bottom: 1rem;
    justify-content: center;
    position: relative;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
        outline: 1px dashed #ccc;
    }
`;

// const TableExpandButton = styled.div`
//     right: 6rem;
//     top: .2rem;
//     font-size: 1.5rem;
//     position: absolute;
//     color: #999;
//     cursor: pointer;
//     transition: .2s ease;
//     &:hover {
//         color: darkgreen;
//     }
// `

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
    padding: .25rem 1rem .25rem 1rem;
    border: 1px solid #ccc;
    background: #ccc;
    color: #333;
    font-size: .9rem;
    white-space: nowrap;
`

const TableCells = styled.td`
    font-size: 1rem;
    padding: .4rem 1rem;
    color: #333;
    text-align: left;
    border: 1px solid #ccc;
`;
