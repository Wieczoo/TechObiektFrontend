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
import Diagram1 from '../images/vaccination_chart.png.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; 

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
  const [simpleAnalysis1, setSimpleAnalysis1] = useState<any[]>([]);
  const [simpleAnalysis2, setSimpleAnalysis2] = useState<any[]>([]);
  const [simpleAnalysis3, setSimpleAnalysis3] = useState<any[]>([]);
  const [complexAnalysis, setComplexAnalysis] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const simpleAnalysis1Response = await axios.get('https://localhost:7119/api/VaccinationData/analysis/simple1');
        console.log('Simple Analysis 1:', simpleAnalysis1Response.data);
        setSimpleAnalysis1(simpleAnalysis1Response.data);
        
        const simpleAnalysis2Response = await axios.get('https://localhost:7119/api/VaccinationData/analysis/simple2');
        console.log('Simple Analysis 2:', simpleAnalysis2Response.data);
        setSimpleAnalysis2(simpleAnalysis2Response.data);
        
        const simpleAnalysis3Response = await axios.get('https://localhost:7119/api/VaccinationData/analysis/simple3');
        console.log('Simple Analysis 3:', simpleAnalysis3Response.data);
        setSimpleAnalysis3(simpleAnalysis3Response.data);
        
        const complexAnalysisResponse = await axios.get('https://localhost:7119/api/VaccinationData/analysis/complex');
        console.log('Complex Analysis:', complexAnalysisResponse.data);
        setComplexAnalysis(complexAnalysisResponse.data);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  
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

  const prepareChartData = () => {
    return simpleAnalysis1.map(item => ({
      country: item.country,
      totalVaccinations: item.totalVaccinations
    }));
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
          <div>
            <h1> diagram</h1>
            <img src={Diagram1} alt="Diagram" className="image" />  
            <BarChart width={600} height={300} data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalVaccinations" fill="#8884d8" />
            </BarChart>
          </div>
        )}
        {selectedTab === 'analysis' && (
          <div>
            <h1>Analysis</h1>
            <h2>Total Vaccinations by Country</h2>
            <ul>
              {simpleAnalysis1.map(item => (
                <li key={item.country}>Country: {item.country}, Total Vaccinations: {item.totalVaccinations}</li>
              ))}
            </ul>
            <h2>Average Vaccinations Per Year</h2>
            <ul>
              {simpleAnalysis2.map(item => (
                <li key={item.year}>Year: {item.year}, Average Vaccinations: {item.averageVaccinations}</li>
              ))}
            </ul>
            <h2>Disease Counts</h2>
            <ul>
              {simpleAnalysis3.map(item => (
                <li key={item.disease}>Disease: {item.disease}, Count: {item.count}</li>
              ))}
            </ul>
            <h2>Total Vaccinations by Time Type</h2>
            <ul>
              {complexAnalysis.map(item => (
                <li key={item.timeType}>Time Type: {item.timeType}, Total Vaccinations: {item.totalVaccinations}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccinationDataPage;
