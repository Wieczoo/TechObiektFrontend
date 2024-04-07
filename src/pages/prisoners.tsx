import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import './Education.css';
import Diagram1 from '../images/prisoners_chart.png.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Prisoners {
  id: string;
  variableName: string;
  country: string;
  prisonerType: string;
  categoriesInmates: string;
  sex: string;
  informationTypeUnitofMeasure: string;
  year: number;
  value: number;
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

const PrisonersPage: React.FC = () => {
  const [prisonersData, setPrisonersData] = useState<Prisoners[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('date');
  const [averagePrisonersPerCountry, setAveragePrisonersPerCountry] = useState<any[]>([]);
  const [prisonerTypeDistribution, setPrisonerTypeDistribution] = useState<any[]>([]);
  const [prisonersInCountriesByYear, setPrisonersInCountriesByYear] = useState<any[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const averagePrisonersResponse = await axios.get('https://localhost:7119/api/prisoners/average-prisoners-per-country');
        setAveragePrisonersPerCountry(averagePrisonersResponse.data);

        const prisonerTypeDistributionResponse = await axios.get('https://localhost:7119/api/prisoners/prisoner-type-distribution');
        setPrisonerTypeDistribution(prisonerTypeDistributionResponse.data);

        const prisonersInCountriesByYearResponse = await axios.get('https://localhost:7119/api/prisoners/prisoners-in-countries-by-year');
        setPrisonersInCountriesByYear(prisonersInCountriesByYearResponse.data);

        const trendAnalysisResponse = await axios.get('https://localhost:7119/api/prisoners/trend-analysis');
        setTrendAnalysis(trendAnalysisResponse.data);
      } catch (error) {
        console.error('Error fetching prisoners data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Prisoners[]>('https://localhost:7119/api/Prisoners');
        setPrisonersData(response.data);
      } catch (error) {
        console.error('Error fetching prisoners data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExportToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {prisonersData.map(prisoner => (
              <View key={prisoner.id}>
                <Text>ID: {prisoner.id}</Text>
                <Text>Nazwa zmiennej: {prisoner.variableName}</Text>
                <Text>Kraj: {prisoner.country}</Text>
                <Text>Typ więźnia: {prisoner.prisonerType}</Text>
                <Text>Kategorie więźniów: {prisoner.categoriesInmates}</Text>
                <Text>Płeć: {prisoner.sex}</Text>
                <Text>Typ informacji: {prisoner.informationTypeUnitofMeasure}</Text>
                <Text>Rok: {prisoner.year}</Text>
                <Text>Wartość: {prisoner.value}</Text>
                <Text>------------------------------------</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'prisoners.pdf');
  };
  const handleExportDiagramToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Diagram Data</Text>
            <img src={Diagram1} alt="Diagram" className="image" />
          </View>
        </Page>
      </Document>
    );
  
    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'diagram.pdf');
  };
  
  const handleExportAnalysisToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <h1>Analysis</h1>
            <h2>Average Prisoners per Country</h2>
            <ul>
              {averagePrisonersPerCountry.map((item, index) => (
                <li key={index}>{item.country}: {item.averagePrisoners}</li>
              ))}
            </ul>
            <h2>Prisoner Type Distribution</h2>
            <ul>
              {prisonerTypeDistribution.map((item, index) => (
                <li key={index}>{item.prisonerType}: {item.totalPrisoners}</li>
              ))}
            </ul>
            <h2>Prisoners in Countries by Year</h2>
            <ul>
              {prisonersInCountriesByYear.map((item, index) => (
                <li key={index}>{item.country}: {item.totalPrisoners}</li>
              ))}
            </ul>
            <h2>Trend Analysis</h2>
            <ul>
              {trendAnalysis.map((item, index) => (
                <li key={index}>{item.year}: {item.totalPrisoners}</li>
              ))}
            </ul>
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'analysis.pdf');
  };
  
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(prisonersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prisoners');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'prisoners.xlsx');
  };
  const handleExportDiagramToExcel = () => {
    const diagramData = [{ sex: 'Male', value: 100 }, { sex: 'Female', value: 200 }]; // Dane dla wykresu
  
    const worksheet = XLSX.utils.json_to_sheet(diagramData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Diagram Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'diagram.xlsx');
  };
  
  const handleExportAnalysisToExcel = () => {
    const analysisData = [{ year: 2021, totalPrisoners: 500 }, { year: 2022, totalPrisoners: 600 }]; // Dane analizy
  
    const worksheet = XLSX.utils.json_to_sheet(analysisData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'analysis.xlsx');
  };
  
  return (
    <div>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <span className="education-text">PRISONERS</span>
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
                  <th>Typ więźnia</th>
                  <th>Kategorie więźniów</th>
                  <th>Płeć</th>
                  <th>Typ informacji z jednostką miary</th>
                  <th>Rok</th>
                  <th>Wartość</th>
                </tr>
              </thead>
              <tbody>
                {prisonersData.map((prisoner, index) => (
                  <tr key={prisoner.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
                    <td>{prisoner.id}</td>
                    <td>{prisoner.variableName}</td>
                    <td>{prisoner.country}</td>
                    <td>{prisoner.prisonerType}</td>
                    <td>{prisoner.categoriesInmates}</td>
                    <td>{prisoner.sex}</td>
                    <td>{prisoner.informationTypeUnitofMeasure}</td>
                    <td>{prisoner.year}</td>
                    <td>{prisoner.value}</td>
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
            <BarChart width={600} height={300} data={prisonersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sex" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        )}
        {selectedTab === 'analysis' && (
          <div>
             <button className="pdf-button" onClick={handleExportAnalysisToPDF}><FaFilePdf />  PDF</button>
             <button className="excel-button" onClick={handleExportAnalysisToExcel}><FaFileExcel />  Excel</button>
            <h1>Analysis</h1>

            <h2>Average Prisoners per Country</h2>
            <ul>
              {averagePrisonersPerCountry.map((item, index) => (
                <li key={index}>{item.country}: {item.averagePrisoners}</li>
              ))}
            </ul>

            <h2>Prisoner Type Distribution</h2>
            <ul>
              {prisonerTypeDistribution.map((item, index) => (
                <li key={index}>{item.prisonerType}: {item.totalPrisoners}</li>
              ))}
            </ul>

            <h2>Prisoners in Countries by Year</h2>
            <ul>
              {prisonersInCountriesByYear.map((item, index) => (
                <li key={index}>{item.country}: {item.totalPrisoners}</li>
              ))}
            </ul>

            <h2>Trend Analysis</h2>
            <ul>
              {trendAnalysis.map((item, index) => (
                <li key={index}>{item.year}: {item.totalPrisoners}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrisonersPage;
