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
import Diagram1 from '../images/education_chart.png.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  const [trendAnalysis, setTrendAnalysis] = useState<any[]>([]);
  const [distributionBySchoolType, setDistributionBySchoolType] = useState<any[]>([]);
  const [changeByGender, setChangeByGender] = useState<any[]>([]);
  const [correlationAnalysis, setCorrelationAnalysis] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendAnalysisResponse = await axios.get('https://localhost:7119/api/Education/education-trend-analysis');
        console.log('Trend Analysis:', trendAnalysisResponse.data);
        setTrendAnalysis(trendAnalysisResponse.data);
  
        const distributionBySchoolTypeResponse = await axios.get('https://localhost:7119/api/Education/education-distribution-by-school-type');
        console.log('Distribution by School Type:', distributionBySchoolTypeResponse.data);
        setDistributionBySchoolType(distributionBySchoolTypeResponse.data);
  
        const changeByGenderResponse = await axios.get('https://localhost:7119/api/Education/education-change-by-gender');
        console.log('Change by Gender:', changeByGenderResponse.data);
        setChangeByGender(changeByGenderResponse.data);
  
        const correlationAnalysisResponse = await axios.get('https://localhost:7119/api/Education/education-correlation-analysis');
        console.log('Correlation Analysis:', correlationAnalysisResponse.data);
        setCorrelationAnalysis(correlationAnalysisResponse.data);
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  
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
          <div>
         <h1> diagram</h1>
         <img src={Diagram1} alt="Diagram" className="image" />  
         <BarChart width={600} height={300} data={distributionBySchoolType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="schoolType" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalValue" fill="#8884d8" />
            </BarChart>
         </div>
        )}
      {selectedTab === 'analysis' && (
  <div>
    <h1>Analysis</h1>
    <div>
      <h2>Trend Analysis</h2>
      {trendAnalysis.map((analysis, index) => (
        <div key={index}>
          <p>Year: {analysis.year}, Total Value: {analysis.totalValue}</p>
        </div>
      ))}
    </div>
    <div>
      <h2>Distribution by School Type</h2>
      <ul>
        {distributionBySchoolType.map(item => (
          <li key={item.schoolType}>
            School Type: {item.schoolType}, Total Value: {item.totalValue}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Change by Gender</h2>
      <ul>
        {changeByGender.map(item => (
          <li key={item.gender}>
            Gender: {item.gender}, Total Value: {item.totalValue}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h2>Correlation Analysis</h2>
      <p>{correlationAnalysis}</p>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default EducationPage;
