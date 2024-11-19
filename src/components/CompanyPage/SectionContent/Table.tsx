/*
import React from 'react';
import {BasicPie} from "@/components/mui/PieChart";
import {styled} from "styled-components";

interface Props {
    contentId: string;
}

function Table() {
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
            {/!*<TableExpandButton><FontAwesomeIcon icon={faPlusCircle} /></TableExpandButton>*!/}
        </TableContainer>
    );
}

export default Table;

const TableContainer = styled.div`
    margin-top: 1rem;
    min-width: 30vw;
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
    padding: .25rem 3rem .25rem 1.5rem;
    border: 1px solid #ccc;
    background: #ccc;
    color: #555;
`

const TableCells = styled.td`
    font-size: 1rem;
    padding: .25rem 2rem;
    color: #333;
    text-align: left;
    border: 1px solid #ccc;
`;*/
