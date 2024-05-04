import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Analysis {
  average: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
}

const ExperimentalDataPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('date');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [xValue, setXValue] = useState<string>('');
  const [yValue, setYValue] = useState<string>('');
  const [analysis, setAnalysis] = useState<Record<string, Analysis>>({});

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const fileData = reader.result as string;
      const parsedData = fileData.split('\n').map((row: string) => row.split(',').map((cell: string) => cell.trim()));
      setCsvData(parsedData);
      calculateAnalysis(parsedData);
    };
  };

  const calculateAnalysis = (data: string[][]) => {
    if (data.length > 0) {
      const columnAnalysis: Record<string, Analysis> = {};
      data[0].forEach((header, index) => {
        const values = data.slice(1).map(row => Number(row[index])).filter(value => !isNaN(value));
        columnAnalysis[header] = {
          average: values.reduce((acc, curr) => acc + curr, 0) / values.length,
          median: calculateMedian(values),
          min: Math.min(...values),
          max: Math.max(...values),
          standardDeviation: calculateStandardDeviation(values)
        };
      });
      setAnalysis(columnAnalysis);
    }
  };

  const calculateMedian = (values: number[]) => {
    const sortedValues = values.sort((a, b) => a - b);
    const middle = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
      return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
    } else {
      return sortedValues[middle];
    }
  };

  const calculateStandardDeviation = (values: number[]) => {
    const mean = values.reduce((acc, curr) => acc + curr, 0) / values.length;
    const variance = values.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  return (
    <div>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <span className="education-text">EXPERIMENTAL DATA</span>
          <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
            <Tab label="Date" value="date" />
            <Tab label="Diagram" value="diagram" />
            <Tab label="Analysis" value="analysis" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '64px' }}>
        {selectedTab === 'date' && (
          <div>
            <p>Click to upload CSV file:</p>
            <input type="file" accept=".csv" onChange={handleCSVUpload} />
            <table>
              <thead>
                <tr>
                  {csvData.length > 0 &&
                    csvData[0].map((cell: string, index: number) => (
                      <th key={index}>{cell}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {csvData.length > 0 &&
                  csvData.slice(1).map((row: string[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedTab === 'diagram' && (
          <div>
            <h1>Diagram</h1>
            <h2>Wybierz opcje</h2>
            <div>
              <label htmlFor="x-value">X Value:</label>
              <select id="x-value" value={xValue} onChange={(e) => setXValue(e.target.value)}>
                <option value="">Choose X Value</option>
                {csvData[0] &&
                  csvData[0].map((cell: string, index: number) => (
                    <option key={index} value={cell}>
                      {cell}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="y-value">Y Value:</label>
              <select id="y-value" value={yValue} onChange={(e) => setYValue(e.target.value)}>
                <option value="">Choose Y Value</option>
                {csvData[0] &&
                  csvData[0].map((cell: string, index: number) => (
                    <option key={index} value={cell}>
                      {cell}
                    </option>
                  ))}
              </select>
            </div>
            {xValue && yValue && (
              <div>
                <BarChart
                  width={600}
                  height={300}
                  data={csvData.slice(1).map((row: string[]) => ({
                    [xValue]: row[csvData[0].indexOf(xValue)],
                    [yValue]: row[csvData[0].indexOf(yValue)]
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xValue} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={yValue} fill="#8884d8" />
                </BarChart>
              </div>
            )}
          </div>
        )}
        {selectedTab === 'analysis' && (
          <div>
            <h1>Analysis</h1>
            <table>
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Average</th>
                  <th>Median</th>
                  <th>Minimum</th>
                  <th>Maximum</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analysis).map(([column, values]: [string, Analysis]) => (
                  <tr key={column}>
                    <td>{column}</td>
                    <td>{values.average.toFixed(2)}</td>
                    <td>{values.median.toFixed(2)}</td>
                    <td>{values.min.toFixed(2)}</td>
                    <td>{values.max.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentalDataPage;
