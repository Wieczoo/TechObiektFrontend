import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import './Height.css';
import Diagram1 from '../images/height_chart.png.png';
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
  const [growthAnalysis, setGrowthAnalysis] = useState<string>(''); 
  const [ageGroupAnalysis, setAgeGroupAnalysis] = useState<string>(''); 
  const [meanHeight, setMeanHeight] = useState<number>(0);
  const [medianHeight, setMedianHeight] = useState<number>(0);
  const [standardDeviation, setStandardDeviation] = useState<number>(0);
  const [tallestCountry, setTallestCountry] = useState<string>(''); 
  const [tallestCountryHeight, setTallestCountryHeight] = useState<number>(0); 

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      try {
        const response = await axios.get<any>('https://localhost:7119/api/Height/tallest-country');
        console.log('Full response from tallest country endpoint:', response);
        if (response.data) {
          setTallestCountry(response.data.tallestCountry);
          setTallestCountryHeight(response.data.averageHeight);
          console.log("Updated tallest country height:", response.data.tallestCountryHeight); 
        }
      } catch (error) {
        console.error('Error fetching tallest country data:', error);
      }
    };
  
    fetchDataAndUpdateState();
  }, []);
  
  
  
  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meanHeightResponse = await axios.get<number>('https://localhost:7119/api/Height/mean');
        const medianHeightResponse = await axios.get<number>('https://localhost:7119/api/Height/median');
        const standardDeviationResponse = await axios.get<number>('https://localhost:7119/api/Height/standard-deviation');
  
        
        setMeanHeight(meanHeightResponse.data);
        setMedianHeight(medianHeightResponse.data);
        setStandardDeviation(standardDeviationResponse.data);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
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

  const handleExportDiagramToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <img src={Diagram1} alt="Diagram" className="image" />
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'height_diagram.pdf');
  };

  const handleExportAnalysisToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Analiza wzrostu: {growthAnalysis}</Text>
            <Text>Analiza wysokości dla grup wiekowych:</Text>
            {ageGroupAnalysis.split('\n').map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
            <Text>Średnia wysokość: {meanHeight}</Text>
            <Text>Mediana wysokości: {medianHeight}</Text>
            <Text>Odchylenie standardowe: {standardDeviation}</Text>
            <Text>Nazwa kraju: {tallestCountry}</Text>
            <Text>Średni wzrost: {tallestCountryHeight}</Text>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'height_analysis.pdf');
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(heights);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Heights');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'heights.xlsx');
  };

  const handleExportDiagramToExcel = () => {
    // Tworzenie arkusza kalkulacyjnego z obrazem diagramu
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById('diagram-table'));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Diagram');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'height_diagram.xlsx');
  };
  
  const handleExportAnalysisToExcel = () => {
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById('analysis-table'));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'height_analysis.xlsx');
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
        {selectedTab === 'date' && (
          <div>
              <button className="pdf-button" onClick={handleExportToPDF}><FaFilePdf />  PDF</button>
        <button className="excel-button" onClick={handleExportToExcel}><FaFileExcel />  Excel</button>
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
             <button className="pdf-button" onClick={handleExportDiagramToPDF}><FaFilePdf />  PDF</button>
             <button className="excel-button" onClick={handleExportDiagramToExcel}><FaFileExcel />  Excel</button>
            <img src={Diagram1} alt="Diagram" className="image" />  
          </div>
        )}
        {selectedTab === 'analysis' && (
          <div>
             <button className="pdf-button" onClick={handleExportAnalysisToPDF}><FaFilePdf />  PDF</button>
             <button className="excel-button" onClick={handleExportAnalysisToExcel}><FaFileExcel />  Excel</button>
            <h2>Analiza wzrostu</h2>
            <p>{growthAnalysis}</p>
            <h2>Analiza wysokości dla grup wiekowych</h2>
            <pre>{ageGroupAnalysis}</pre>
            <h2>Średnia wysokość: </h2>
            <p>{meanHeight}</p>
    <h2>Mediana wysokości:</h2>
    <p> {medianHeight}</p>
    <h2>Odchylenie standardowe:</h2>
     <p>{standardDeviation}</p>
    <h2>Nazwa kraju: </h2>
      <p>{tallestCountry}</p>
      <h2>Średni wzrost:</h2> 
      <p>{tallestCountryHeight}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeightPage;