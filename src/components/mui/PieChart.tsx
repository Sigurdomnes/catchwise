import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

interface TableData {
  _id?: string;
  name: string;
  headers: string[];
  rows: string[][];
  orderValue?: number;
}

interface BasicPieProps {
  tableData: TableData;
}

export const BasicPie: React.FC<BasicPieProps> = ({ tableData }) => {
  const chartData = tableData.rows.map((row, index) => ({
    id: index,
    name: name,
    label: row[0],
    value: parseFloat(row[1]),
  }));
  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.value}%`,
          arcLabelMinAngle: 35,
          arcLabelRadius: '60%',
          data: chartData, // Use the transformed data
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: 'bold',
        },
      }}
      width={400}
      height={200}
    />
  );
}