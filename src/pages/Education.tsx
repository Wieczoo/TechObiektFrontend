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
  [key: string]: string | number; 
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
  const [searchValue, setSearchValue] = useState<string>('');
  const [xValue, setXValue] = useState<string>('');
  const [yValue, setYValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<Education | null>(null);
  const [newRow, setNewRow] = useState<Education>({
    id: '',
    nazwa_zmiennej: '',
    kraj: '',
    wojewodztwo: '',
    typ_szkoly: '',
    plec_absolwenta: '',
    rodzaj_wskaznika: '',
    typ_informacji_z_jednostka_miary: '',
    rok_szkolny:'',
    wartosc: 0,
    flaga:0,
  });
  const [showAddRowForm, setShowAddRowForm] = useState<boolean>(false);

  const handleAddNewRow = () => {
    setShowAddRowForm(true);
  };

  const handleSaveNewRow = async () => {
    try {
      const response = await axios.post('https://localhost:7119/api/Education', newRow);
      console.log('Added new row:', response.data);
      setEducationData([...educationData, response.data]);
      setShowAddRowForm(false);
      setNewRow({
        id: '',
    nazwa_zmiennej: '',
    kraj: '',
    wojewodztwo: '',
    typ_szkoly: '',
    plec_absolwenta: '',
    rodzaj_wskaznika: '',
    typ_informacji_z_jednostka_miary: '',
    rok_szkolny:'',
    wartosc: 0,
    flaga:0,
      });
    } catch (error) {
      console.error('Error adding new row:', error);
    }
  };


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

  const handleEdit = (row: Education) => {
    setIsEditing(true);
    setEditRow(row);
  };

  const handleSave = async () => {
    try {
      if (editRow) {
        const response = await axios.put(`https://localhost:7119/api/Education/${editRow.id}`, editRow);
        console.log('Saved changes:', response.data);
        const updatedEducationData = educationData.map(education => {
          if (education.id === editRow.id) {
            return editRow;
          }
          return education;
        });
        setEducationData(updatedEducationData);
        setIsEditing(false);
        setEditRow(null);
      } else {
        console.error('No row to save');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`https://localhost:7119/api/Education/${id}`);
      console.log('Deleted row:', response.data);
      const updatedEducationData = educationData.filter(education => education.id !== id);
      setEducationData(updatedEducationData);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
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
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Wyszukaj..."
    />
    <button className="pdf-button" onClick={handleExportToPDF}><FaFilePdf />  PDF</button>
    <button className="excel-button" onClick={handleExportToExcel}><FaFileExcel />  Excel</button>
    <button className="add-button" onClick={handleAddNewRow} style={{ marginLeft: '20px' }}>Dodaj nowy wiersz</button>
            {showAddRowForm && (
              <div className="form">
                  <input
                  type="text"
                  value={newRow.nazwa_zmiennej}
                  onChange={(e) => setNewRow({ ...newRow, nazwa_zmiennej: e.target.value })}
                  placeholder="Nazwa zmiennej"
                />
                <input
                style={{ width: "125px" }}
                  type="text"
                  value={newRow.kraj}
                  onChange={(e) => setNewRow({ ...newRow, kraj: e.target.value })}
                  placeholder="Kraj"
                />
                <input
                  type="text"
                  value={newRow.wojewodztwo}
                  onChange={(e) => setNewRow({ ...newRow, wojewodztwo: e.target.value })}
                  placeholder="Województwo"
                />
                <input
                  type="text"
                  value={newRow.typ_szkoly}
                  onChange={(e) => setNewRow({ ...newRow, typ_szkoly: e.target.value })}
                  placeholder="Szkoła"
                />
                <input
                  type="text"
                  value={newRow.plec_absolwenta}
                  onChange={(e) => setNewRow({ ...newRow, plec_absolwenta: e.target.value })}
                  placeholder="Płeć"
                />
                <input
                  type="number"
                  value={newRow.rodzaj_wskaznika}
                  onChange={(e) => setNewRow({ ...newRow, rodzaj_wskaznika: e.target.value })}
                  placeholder="Rodzaj"
                />
                <input
                  type="number"
                  value={newRow.typ_informacji_z_jednostka_miary}
                  onChange={(e) => setNewRow({ ...newRow, typ_informacji_z_jednostka_miary: e.target.value })}
                  placeholder="Typ informacji"
                />
                <input
                style={{ width: "65px" }}
                  type="number"
                  value={newRow.wartosc}
                  onChange={(e) => setNewRow({ ...newRow, wartosc: Number(e.target.value) })}
                  placeholder="Wartość"
                />
                <input
                style={{ width: "65px" }}
                  type="number"
                  value={newRow.flaga}
                  onChange={(e) => setNewRow({ ...newRow, flaga: Number(e.target.value) })}
                  placeholder="Flaga"
                />
                <button onClick={handleSaveNewRow}>Dodaj</button>
    <button onClick={() => setShowAddRowForm(false)}>Anuluj</button>
              </div>
            )}
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
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {educationData
          .filter((education) => {
            const searchString = searchValue.toLowerCase();
            const id = education.id.toLowerCase();
            const nazwaZmiennej = education.nazwa_zmiennej.toLowerCase();
            const kraj = education.kraj.toLowerCase();
            const wojewodztwo = education.wojewodztwo.toLowerCase();
            const typSzkoly = education.typ_szkoly.toLowerCase();
            const plecAbsolwenta = education.plec_absolwenta.toLowerCase();
            const rodzajWskaźnika = education.rodzaj_wskaznika.toLowerCase();
            const typInformacji = education.typ_informacji_z_jednostka_miary.toLowerCase();
            const rokSzkolny = education.rok_szkolny.toLowerCase();
            const wartosc = education.wartosc.toString().toLowerCase();
            const flaga = education.flaga.toString().toLowerCase();
            return (
              id.includes(searchString) ||
              nazwaZmiennej.includes(searchString) ||
              kraj.includes(searchString) ||
              wojewodztwo.includes(searchString) ||
              typSzkoly.includes(searchString) ||
              plecAbsolwenta.includes(searchString) ||
              rodzajWskaźnika.includes(searchString) ||
              typInformacji.includes(searchString) ||
              rokSzkolny.includes(searchString) ||
              wartosc.includes(searchString) ||
              flaga.includes(searchString)
            );
          })
          .map((education, index) => (
            <tr key={education.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
              <td>{education.id}</td>
              <td>{education.nazwa_zmiennej}</td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.kraj}
                    onChange={(e) => setEditRow({ ...editRow, kraj: e.target.value })}
                    style={{ maxWidth: '70px' }}
                  />
                ) : (
                  education.kraj
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.wojewodztwo}
                    onChange={(e) => setEditRow({ ...editRow, wojewodztwo: e.target.value })}
                    style={{ maxWidth: '70px' }}
                  />
                ) : (
                  education.wojewodztwo
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.typ_szkoly}
                    onChange={(e) => setEditRow({ ...editRow, typ_szkoly: e.target.value })}
                    style={{ maxWidth: '90px' }}
                  />
                ) : (
                  education.typ_szkoly
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.plec_absolwenta}
                    onChange={(e) => setEditRow({ ...editRow, plec_absolwenta: e.target.value })}
                    style={{ maxWidth: '65px' }}
                  />
                ) : (
                  education.plec_absolwenta
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.rodzaj_wskaznika}
                    onChange={(e) => setEditRow({ ...editRow, rodzaj_wskaznika: e.target.value })}
                    style={{ maxWidth: '60px' }}
                  />
                ) : (
                  education.rodzaj_wskaznika
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.typ_informacji_z_jednostka_miary}
                    onChange={(e) => setEditRow({ ...editRow, typ_informacji_z_jednostka_miary: e.target.value })}
                    style={{ maxWidth: '80px' }}
                  />
                ) : (
                  education.typ_informacji_z_jednostka_miary
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.rok_szkolny}
                    onChange={(e) => setEditRow({ ...editRow, rok_szkolny: e.target.value })}
                    style={{ maxWidth: '70px' }}
                  />
                ) : (
                  education.rok_szkolny
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.wartosc}
                    onChange={(e) => setEditRow({ ...editRow, wartosc: Number(e.target.value) })}
                    style={{ maxWidth: '30px' }}
                  />
                ) : (
                  education.wartosc
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <input
                    type="text"
                    value={editRow.flaga}
                    onChange={(e) => setEditRow({ ...editRow, flaga: Number(e.target.value) })}
                    style={{ maxWidth: '20px' }}
                  />
                ) : (
                  education.flaga
                )}
              </td>
              <td>
                {isEditing && editRow?.id === education.id ? (
                  <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => { setIsEditing(false); setEditRow(null); }}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleEdit(education)}>Edit</button>
                    <button onClick={() => handleDelete(education.id)}>Usuń</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)}
{selectedTab === 'diagram' && (
  <div>
    <img src={Diagram1} alt="Diagram" className="image" />  
    <h1>Diagram</h1>
    <h2>Wybierz opcje</h2>
    <div>
      <label htmlFor="x-value">X Value:</label>
      <select id="x-value" value={xValue} onChange={(e) => setXValue(e.target.value)}>
        <option value="">Wybierz X Value</option>
        <option value="id">ID</option>
        <option value="nazwa_zmiennej">Nazwa zmiennej</option>
        <option value="kraj">Kraj</option>
        <option value="typ_szkoly">Typ szkoły</option>
        <option value="plec_absolwenta">Płeć absolwenta</option>
        <option value="rodzaj_wskaznika">Rodzaj wskaźnika</option>
        <option value="typ_informacji_z_jednostka_miary">Typ informacji z jednostką miary</option>
        <option value="rok_szkolny">Rok szkolny</option>
        <option value="wartosc">Wartość</option>
        <option value="flaga">Flaga</option>
      </select>
    </div>
    <div>
      <label htmlFor="y-value">Y Value:</label>
      <select id="y-value" value={yValue} onChange={(e) => setYValue(e.target.value)}>
        <option value="">Wybierz Y Value</option>
        <option value="id">ID</option>
        <option value="nazwa_zmiennej">Nazwa zmiennej</option>
        <option value="kraj">Kraj</option>
        <option value="typ_szkoly">Typ szkoły</option>
        <option value="plec_absolwenta">Płeć absolwenta</option>
        <option value="rodzaj_wskaznika">Rodzaj wskaźnika</option>
        <option value="typ_informacji_z_jednostka_miary">Typ informacji z jednostką miary</option>
        <option value="rok_szkolny">Rok szkolny</option>
        <option value="wartosc">Wartość</option>
        <option value="flaga">Flaga</option>
      </select>
    </div>
    {xValue && yValue && (
      <div>
        <BarChart width={600} height={300} data={educationData.map(data => ({ [xValue]: data[xValue], [yValue]: data[yValue] }))}>
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
      {distributionBySchoolType.map((distribution, index) => (
        <div key={index}>
          <p>School Type: {distribution.schoolType}, Total Value: {distribution.totalValue}</p>
        </div>
      ))}
    </div>
    <div>
      <h2>Change by Gender</h2>
      {changeByGender.map((change, index) => (
        <div key={index}>
          <p>Gender: {change.gender}, Total Change: {change.totalChange}</p>
        </div>
      ))}
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
