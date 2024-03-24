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

interface VaccinationData {
  id: string;
  nazwa_zmiennej: string;
  kraj: string;
  rodzaj_choroby: string;
  czas_typ_szczepienia: string;
  typ_informacji_z_jednostka_miary: string;
  rok: number;
  wartosc: number;
  zmienna: number;
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

const VaccinationDataPage: React.FC = () => {
  const [vaccinationData, setVaccinationData] = useState<VaccinationData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('date');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<VaccinationData[]>('https://localhost:7119/api/VaccinationData');
        setVaccinationData(response.data);
      } catch (error) {
        console.error('Error fetching vaccination data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExportToPDF = async () => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {vaccinationData.map(data => (
              <View key={data.id}>
                <Text>ID: {data.id}</Text>
                <Text>Nazwa zmiennej: {data.nazwa_zmiennej}</Text>
                <Text>Kraj: {data.kraj}</Text>
                <Text>Rodzaj choroby: {data.rodzaj_choroby}</Text>
                <Text>Czas/typ szczepienia: {data.czas_typ_szczepienia}</Text>
                <Text>Typ informacji: {data.typ_informacji_z_jednostka_miary}</Text>
                <Text>Rok: {data.rok}</Text>
                <Text>Wartość: {data.wartosc}</Text>
                <Text>Zmienna: {data.zmienna}</Text>
                <Text>------------------------------------</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'vaccination_data.pdf');
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vaccinationData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'VaccinationData');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'vaccination_data.xlsx');
  };

  return (
    <div>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <span className="education-text">VACCINATION DATA</span>
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
                  <th>Rodzaj choroby</th>
                  <th>Czas/typ szczepienia</th>
                  <th>Typ informacji z jednostką miary</th>
                  <th>Rok</th>
                  <th>Wartość</th>
                  <th>Zmienna</th>
                </tr>
              </thead>
              <tbody>
                {vaccinationData.map((data, index) => (
                  <tr key={data.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
                    <td>{data.id}</td>
                    <td>{data.nazwa_zmiennej}</td>
                    <td>{data.kraj}</td>
                    <td>{data.rodzaj_choroby}</td>
                    <td>{data.czas_typ_szczepienia}</td>
                    <td>{data.typ_informacji_z_jednostka_miary}</td>
                    <td>{data.rok}</td>
                    <td>{data.wartosc}</td>
                    <td>{data.zmienna}</td>
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

export default VaccinationDataPage;
