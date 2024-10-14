import React, { useState } from 'react';
import styled from 'styled-components';
import { TableData } from '../../utils/interface'

interface EditableTableProps {
    sectionId: string | undefined;
    onSaveTable: (sectionId: string | undefined, tableData: TableData) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ sectionId, onSaveTable }) => {
    const [tableName, setTableName] = useState<string>('');
    const [numColumns, setNumColumns] = useState<number>(2);
    const [headers, setHeaders] = useState<string[]>(Array(2).fill(''));
    const [rows, setRows] = useState<string[][]>([Array(2).fill('')]);

    const handleHeaderChange = (index: number, value: string) => {
        const newHeaders = [...headers];
        newHeaders[index] = value;
        setHeaders(newHeaders);
    };

    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const newRows = [...rows];
        newRows[rowIndex][colIndex] = value;
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, Array(numColumns).fill('')]);
    };

    const handleSaveTable = () => {
        const tableData: TableData = {
            name: tableName,
            headers,
            rows,
        };
        onSaveTable(sectionId, tableData);
    };

    const handleNumColumnsChange = (value: number) => {
        setNumColumns(value);
        setHeaders(Array(value).fill(''));
        setRows(rows.map(row => Array(value).fill('')));
    };

    return (
        <TableContainer>
            <TableNameInput
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Skriv inn tabellnavn..."
            />
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <TableHeaders key={index}>
                                <Input
                                    type="text"
                                    value={header}
                                    onChange={(e) => handleHeaderChange(index, e.target.value)}
                                    placeholder={`Beskrivelse ${index + 1}`}
                                />
                            </TableHeaders>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <TableCells key={colIndex}>
                                    <Input
                                        type="text"
                                        value={cell}
                                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                        placeholder={`Rad ${rowIndex + 1}, Kolonne ${colIndex + 1}`}
                                    />
                                </TableCells>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Container>
                <Select
                    value={numColumns}
                    onChange={(e) => handleNumColumnsChange(Number(e.target.value))}
                >
                    {[2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num} Kolonner
                        </option>
                    ))}
                </Select>
                <Button onClick={addRow}>Ny rad</Button>
                <SaveButton onClick={handleSaveTable}>Lagre tabell</SaveButton>
            </Container>
        </TableContainer>
    );
};

export default EditableTable;

const TableContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 30vw;
  align-self: center;
`;

const Table = styled.table`
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  border-collapse: collapse;
  width: 100%;
`;

const TableHeaders = styled.th`
  font-weight: normal;
  text-align: left;
  border: 1px solid #ccc;
  background: #ccc;
  color: black;
`;

const TableCells = styled.td`
  font-size: 0.9rem;
  padding: 0;
  color: #555;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 0;
`;

const Container = styled.div`
    display: flex;
    gap: .5rem;
    align-self: center;
`

const Select = styled.select`
    background: transparent;
    color: black;
    height: 2rem;
    border-radius: 4px;
    padding: .2rem;
`

const TableNameInput = styled.input`
    background: var(--cwcolor);
    width: 100%;
    font-weight: 600;
    border-radius: 5px;
    text-align: center;
    margin-bottom: .5rem;
    border: none;
    height: 2rem;
    font-size: 1rem;
    padding: 1.2rem;
    color: white;
    &::placeholder {
        color: #ccc;
    }
`

const Input = styled.input`
    background: transparent;
    border: none;
    width: 100%;
    height: 100%;
    padding: 0 1.5rem;
    border-radius: 0;
    height: 2rem;
    font-size: 1rem;
    color: black;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: grey;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 2rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #005bb5;
  }
`

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--cwcolor);
  color: white;
  height: 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: darkgreen;
  }
`;
