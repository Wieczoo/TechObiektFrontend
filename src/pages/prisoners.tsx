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

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(prisonersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prisoners');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'prisoners.xlsx');
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
         <h1> diagram</h1>
        )}
        {selectedTab === 'analysis' && (
          <h1> analysis</h1>
        )}
      </div>
    </div>
  );
};

export default PrisonersPage;
