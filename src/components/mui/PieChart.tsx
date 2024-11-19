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

const standardColors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#FF5722', // Deep Orange
    '#9C27B0', // Purple
    '#3F51B5', // Indigo
    '#FF9800', // Orange
    '#E91E63', // Pink
];

export const BasicPie: React.FC<BasicPieProps> = ({ tableData }) => {
  const totalValue = tableData.rows.reduce((sum, row) => sum + parseFloat(row[1]), 0);
  const chartData = tableData.rows.map((row, index) => ({
    id: index,
    name: name,
    label: row[0],
    value: parseFloat(row[1]),
    color: standardColors[index % standardColors.length],
  }));
  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 -2rem 0 1rem' }}>
          <PieChart
              series={[
                  {
                      arcLabel: (item) => `${(item.value / totalValue * 100).toFixed(0)}%`,
                      arcLabelMinAngle: 35,
                      arcLabelRadius: '60%',
                      highlightScope: {fade: 'global', highlight: 'item'},
                      faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                      data: chartData,
                  },
              ]}
              slotProps={{legend: {hidden: true}}}
              sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                      fontWeight: 'bold',
                  },
              }}
              width={300}
              height={200}
          />
          <div style={{marginTop: '.5rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', gap: '.2rem', justifyContent: 'center'}}>
              {chartData.map((item) => (
                  <div
                      key={item.id}
                      style={{
                          display: 'flex',
                          alignItems: 'center',
                          margin: '0 8px',
                      }}
                  >
                      {/* Color Indicator */}
                      <div
                          style={{
                              width: '14px',
                              height: '14px',
                              backgroundColor: item.color,
                              marginRight: '8px',
                              borderRadius: '50%',
                          }}
                      ></div>
                      {/* Label */}
                      <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>{item.label}</span>
                  </div>
              ))}
          </div>
      </div>
  );
}