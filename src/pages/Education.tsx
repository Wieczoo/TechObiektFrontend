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

interface Education {
  id: string;
  nazwa_zmiennej: string;
  kraj: string;
  wojewodztwo: string;
  typ_szkoly: string;
  plec_absolwenta: string;
  rodzaj_wskaznika: string;
  typ_informacji_z_jednostka_miary: string;
  rok_szkolny: string;
  wartosc: number;
  flaga: number;
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

const EducationPage: React.FC = () => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('date');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Education[]>('https://localhost:7119/api/Education');
        setEducationData(response.data);
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExportToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {educationData.map(education => (
              <View key={education.id}>
                <Text>ID: {education.id}</Text>
                <Text>Nazwa zmiennej: {education.nazwa_zmiennej}</Text>
                <Text>Kraj: {education.kraj}</Text>
                <Text>Województwo: {education.wojewodztwo}</Text>
                <Text>Typ szkoły: {education.typ_szkoly}</Text>
                <Text>Płeć absolwenta: {education.plec_absolwenta}</Text>
                <Text>Rodzaj wskaźnika: {education.rodzaj_wskaznika}</Text>
                <Text>Typ informacji: {education.typ_informacji_z_jednostka_miary}</Text>
                <Text>Rok szkolny: {education.rok_szkolny}</Text>
                <Text>Wartość: {education.wartosc}</Text>
                <Text>Flaga: {education.flaga}</Text>
                <Text>------------------------------------</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'education.pdf');
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(educationData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Education');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'education.xlsx');
  };

  return (
    <div>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <span className="education-text">EDUCATION</span>
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
                  <th>Województwo</th>
                  <th>Typ szkoły</th>
                  <th>Płeć absolwenta</th>
                  <th>Rodzaj wskaźnika</th>
                  <th>Typ informacji z jednostką miary</th>
                  <th>Rok szkolny</th>
                  <th>Wartość</th>
                  <th>Flaga</th>
                </tr>
              </thead>
              <tbody>
                {educationData.map((education, index) => (
                  <tr key={education.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
                    <td>{education.id}</td>
                    <td>{education.nazwa_zmiennej}</td>
                    <td>{education.kraj}</td>
                    <td>{education.wojewodztwo}</td>
                    <td>{education.typ_szkoly}</td>
                    <td>{education.plec_absolwenta}</td>
                    <td>{education.rodzaj_wskaznika}</td>
                    <td>{education.typ_informacji_z_jednostka_miary}</td>
                    <td>{education.rok_szkolny}</td>
                    <td>{education.wartosc}</td>
                    <td>{education.flaga}</td>
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

export default EducationPage;
