import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import './Height.css';

interface Height {
  id: string;
  nazwa_zmiennej: string;
  kraj: string;
  plec: string;
  wiek: string;
  typ_informacji_z_jednostka_miary: string;
  rok: number;
  wartosc: number;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const HeightPage: React.FC = () => {
  const [heights, setHeights] = useState<Height[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('date');
  const [growthAnalysis, setGrowthAnalysis] = useState<string>(''); // Wynik analizy wzrostu
  const [ageGroupAnalysis, setAgeGroupAnalysis] = useState<string>(''); // Analiza wysokości dla grup wiekowych

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Height[]>('https://localhost:7119/api/Height');
        setHeights(response.data);
      } catch (error) {
        console.error('Error fetching heights:', error);
      }
    };

    fetchData();
  }, []);

  const handleExportToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {heights.map(height => (
              <View key={height.id}>
                <Text>ID: {height.id}</Text>
                <Text>Nazwa zmiennej: {height.nazwa_zmiennej}</Text>
                <Text>Kraj: {height.kraj}</Text>
                <Text>Płeć: {height.plec}</Text>
                <Text>Wiek: {height.wiek}</Text>
                <Text>Typ informacji: {height.typ_informacji_z_jednostka_miary}</Text>
                <Text>Rok: {height.rok}</Text>
                <Text>Wartość: {height.wartosc}</Text>
                <Text>------------------------------------</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'heights.pdf');
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(heights);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Heights');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'heights.xlsx');
  };

  // Dane dla wykresu - dane pobrane
  const chartData = heights.map(height => ({ name: height.nazwa_zmiennej, value: height.wartosc }));

  // Analiza wzrostu
  useEffect(() => {
    if (heights.length > 0) {
      const girlsHeights = heights.filter(height => height.plec === 'dziewczynka');
      const boysHeights = heights.filter(height => height.plec === 'chłopiec');

      const girlsAvgHeight = girlsHeights.reduce((sum, height) => sum + height.wartosc, 0) / girlsHeights.length;
      const boysAvgHeight = boysHeights.reduce((sum, height) => sum + height.wartosc, 0) / boysHeights.length;

      if (girlsAvgHeight > boysAvgHeight) {
        setGrowthAnalysis('Dziewczynki rosną szybciej niż chłopcy.');
      } else if (girlsAvgHeight < boysAvgHeight) {
        setGrowthAnalysis('Chłopcy rosną szybciej niż dziewczynki.');
      } else {
        setGrowthAnalysis('Dziewczynki i chłopcy rosną z taką samą średnią szybkością.');
      }

      // Analiza wysokości dla grup wiekowych
      const ageGroups: { [key: string]: Height[] } = {};
      heights.forEach(height => {
        if (!ageGroups[height.wiek]) {
          ageGroups[height.wiek] = [];
        }
        ageGroups[height.wiek].push(height);
      });

      const ageGroupAnalysisResult: string[] = [];
      Object.keys(ageGroups).forEach(ageGroup => {
        const groupHeights = ageGroups[ageGroup];
        const avgHeight = groupHeights.reduce((sum, height) => sum + height.wartosc, 0) / groupHeights.length;
        ageGroupAnalysisResult.push(`Średnia wysokość dla grupy wiekowej ${ageGroup}: ${avgHeight.toFixed(2)} cm`);
      });
      setAgeGroupAnalysis(ageGroupAnalysisResult.join('\n'));
    }
  }, [heights]);

  return (
    <div>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <span className="height-text">HEIGHT</span>
          <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
            <Tab label="Date" value="date" />
            <Tab label="Diagram" value="diagram" />
            <Tab label="Analysis" value="analysis" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '64px' }}>
        <button className="pdf-button" onClick={handleExportToPDF}><FaFilePdf />  PDF</button>
        <button className="excel-button" onClick={handleExportToExcel}><FaFileExcel />  Excel</button>
        {selectedTab === 'date' && (
          <div>
            <table className="table-container">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nazwa zmiennej</th>
                  <th>Kraj</th>
                  <th>Płeć</th>
                  <th>Wiek</th>
                  <th>Typ informacji z jednostką miary</th>
                  <th>Rok</th>
                  <th>Wartość</th>
                </tr>
              </thead>
              <tbody>
                {heights.map((height, index) => (
                  <tr key={height.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
                    <td>{height.id}</td>
                    <td>{height.nazwa_zmiennej}</td>
                    <td>{height.kraj}</td>
                    <td>{height.plec}</td>
                    <td>{height.wiek}</td>
                    <td>{height.typ_informacji_z_jednostka_miary}</td>
                    <td>{height.rok}</td>
                    <td>{height.wartosc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedTab === 'diagram' && (
          <div>
            <BarChart width={800} height={500} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        )}
        {selectedTab === 'analysis' && (
          <div>
            <h2>Analiza wzrostu</h2>
            <p>{growthAnalysis}</p>
            <h2>Analiza wysokości dla grup wiekowych</h2>
            <pre>{ageGroupAnalysis}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeightPage;
