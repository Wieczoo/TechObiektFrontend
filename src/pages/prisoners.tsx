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

const PrisonersPage: React.FC = () => {
  const [prisonersData, setPrisonersData] = useState<Prisoners[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('date');
  const [averagePrisonersPerCountry, setAveragePrisonersPerCountry] = useState<any[]>([]);
  const [prisonerTypeDistribution, setPrisonerTypeDistribution] = useState<any[]>([]);
  const [prisonersInCountriesByYear, setPrisonersInCountriesByYear] = useState<any[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [xValue, setXValue] = useState<string>('');
  const [yValue, setYValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<Prisoners| null>(null);
  const [newRow, setNewRow] = useState<Prisoners>({
    id: '',
    variableName: '',
    country: '',
    prisonerType: '',
    categoriesInmates: '',
    sex: '',
    informationTypeUnitofMeasure: '',
    year: 0,
    value: 0,
  });
  const [showAddRowForm, setShowAddRowForm] = useState<boolean>(false);

  const handleAddNewRow = () => {
    setShowAddRowForm(true);
  };

  const handleSaveNewRow = async () => {
    try {
      const response = await axios.post('https://localhost:7119/api/Prisoners', newRow);
      console.log('Added new row:', response.data);
      setPrisonersData([...prisonersData, response.data]);
      setShowAddRowForm(false);
      setNewRow({
        id: '',
        variableName: '',
        country: '',
        prisonerType: '',
        categoriesInmates: '',
        sex: '',
        informationTypeUnitofMeasure: '',
        year: 0,
        value: 0,
      });
    } catch (error) {
      console.error('Error adding new row:', error);
    }
  };

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
    const diagramData = [{ sex: 'Male', value: 100 }, { sex: 'Female', value: 200 }]; 
    const worksheet = XLSX.utils.json_to_sheet(diagramData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Diagram Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'diagram.xlsx');
  };
  
  const handleExportAnalysisToExcel = () => {
    const analysisData = [{ year: 2021, totalPrisoners: 500 }, { year: 2022, totalPrisoners: 600 }]; 
  
    const worksheet = XLSX.utils.json_to_sheet(analysisData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(excelBlob, 'analysis.xlsx');
  };
  
  const handleEdit = (row: Prisoners) => {
    setIsEditing(true);
    setEditRow(row);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://localhost:7119/api/Prisoners/${id}`);
      const updatedPrisonersData = prisonersData.filter(prisoner => prisoner.id !== id);
      setPrisonersData(updatedPrisonersData);
    } catch (error) {
      console.error('Error deleting prisoner:', error);
    }
  };
  
  const handleSave = async () => {
    try {
      if (editRow) {
        const response = await axios.put(`https://localhost:7119/api/Prisoners/${editRow.id}`, editRow);
        console.log('Saved changes:', response.data);
        const updatedPrisonersData = prisonersData.map(prisoner => {
          if (prisoner.id === editRow.id) {
            return editRow;
          }
          return prisoner;
        });
        setPrisonersData(updatedPrisonersData);
        setIsEditing(false);
        setEditRow(null);
      } else {
        console.error('No row to save');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
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
                  value={newRow.variableName}
                  onChange={(e) => setNewRow({ ...newRow, variableName: e.target.value })}
                  placeholder="Nazwa zmiennej"
                />
                <input
                  type="text"
                  value={newRow.country}
                  onChange={(e) => setNewRow({ ...newRow, country: e.target.value })}
                  placeholder="Kraj"
                />
                <input
                  type="text"
                  value={newRow.prisonerType}
                  onChange={(e) => setNewRow({ ...newRow, prisonerType: e.target.value })}
                  placeholder="Typ więźnia"
                />
                <input
                  type="text"
                  value={newRow.categoriesInmates}
                  onChange={(e) => setNewRow({ ...newRow, categoriesInmates: e.target.value })}
                  placeholder="Kategoria"
                />
                <input
                  type="text"
                  value={newRow.sex}
                  onChange={(e) => setNewRow({ ...newRow, sex: e.target.value })}
                  placeholder="Płeć"
                />
                <input
                  type="number"
                  value={newRow.informationTypeUnitofMeasure}
                  onChange={(e) => setNewRow({ ...newRow, rok: Number(e.target.value) })}
                  placeholder="Informacje"
                />
                <input
                style={{ width: "65px" }}
                  type="number"
                  value={newRow.year}
                  onChange={(e) => setNewRow({ ...newRow, year: Number(e.target.value) })}
                  placeholder="Rok"
                />
                 <input
                 style={{ width: "75px" }}
                  type="number"
                  value={newRow.value}
                  onChange={(e) => setNewRow({ ...newRow, value: Number(e.target.value) })}
                  placeholder="Wartość"
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
          <th></th>
          <th>Kategorie więźniów</th>
          <th>Płeć</th>
          <th>Typ informacji z jednostką miary</th>
          <th>Rok</th>
          <th>Wartość</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {prisonersData
          .filter(prisoner =>
            prisoner.variableName.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((prisoner, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
              <td>{prisoner.id}</td>
              <td>{prisoner.variableName}</td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <input
                    type="text"
                    value={editRow.country}
                    onChange={(e) => setEditRow({ ...editRow, country: e.target.value })}
                    style={{ maxWidth: '52px' }}
                  />
                ) : (
                  prisoner.country
                )}
              </td>
              <td>
              </td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <input
                    type="text"
                    value={editRow.categoriesInmates}
                    onChange={(e) => setEditRow({ ...editRow, categoriesInmates: e.target.value })}
                    style={{ maxWidth: '65px' }}
                  />
                ) : (
                  prisoner.categoriesInmates
                )}
              </td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <input
                    type="text"
                    value={editRow.sex}
                    onChange={(e) => setEditRow({ ...editRow, sex: e.target.value })}
                    style={{ maxWidth: '80px' }}
                  />
                ) : (
                  prisoner.sex
                )}
              </td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <input
                    type="text"
                    value={editRow.informationTypeUnitofMeasure}
                    onChange={(e) => setEditRow({ ...editRow, informationTypeUnitofMeasure: e.target.value })}
                    style={{ maxWidth: '120px' }}
                  />
                ) : (
                  prisoner.informationTypeUnitofMeasure
                )}
              </td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <input
                    type="text"
                    value={editRow.year}
                    onChange={(e) => setEditRow({ ...editRow, year: Number(e.target.value) })}
                    style={{ maxWidth: '45px' }}
                  />
                ) : (
                  prisoner.year
                )}
              </td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <input
                    type="text"
                    value={editRow.value}
                    onChange={(e) => setEditRow({ ...editRow, value: Number(e.target.value) })}
                    style={{ maxWidth: '45px' }}
                  />
                ) : (
                  prisoner.value
                )}
              </td>
              <td>
                {isEditing && editRow?.id === prisoner.id ? (
                  <div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => handleEdit(prisoner)}>Edit</button>
                    <button onClick={() => handleDelete(prisoner.id)}>Usuń</button>
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
    <h2>Choose options</h2>
    <div>
      <label htmlFor="x-value">X Value:</label>
      <select id="x-value" value={xValue} onChange={(e) => setXValue(e.target.value)}>
        <option value="">Choose X Value</option>
        <option value="id">ID</option>
        <option value="variableName">Variable Name</option>
        <option value="country">Country</option>
        <option value="prisonerType">Prisoner Type</option>
        <option value="categoriesInmates">Categories of Inmates</option>
        <option value="sex">Sex</option>
        <option value="informationTypeUnitofMeasure">Information Type with Unit of Measure</option>
        <option value="year">Year</option>
        <option value="value">Value</option>
      </select>
    </div>
    <div>
      <label htmlFor="y-value">Y Value:</label>
      <select id="y-value" value={yValue} onChange={(e) => setYValue(e.target.value)}>
        <option value="">Choose Y Value</option>
        <option value="id">ID</option>
        <option value="variableName">Variable Name</option>
        <option value="country">Country</option>
        <option value="prisonerType">Prisoner Type</option>
        <option value="categoriesInmates">Categories of Inmates</option>
        <option value="sex">Sex</option>
        <option value="informationTypeUnitofMeasure">Information Type with Unit of Measure</option>
        <option value="year">Year</option>
        <option value="value">Value</option>
      </select>
    </div>
    {xValue && yValue && (
      <div>
        <BarChart width={600} height={300} data={prisonersData.map(data => ({ [xValue]: data[xValue], [yValue]: data[yValue] }))}>
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
