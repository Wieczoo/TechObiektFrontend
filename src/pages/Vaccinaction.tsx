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

const VaccinationDataPage: React.FC = () => {
  const [vaccinationData, setVaccinationData] = useState<VaccinationData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('date');
  const [simpleAnalysis1, setSimpleAnalysis1] = useState<any[]>([]);
  const [simpleAnalysis2, setSimpleAnalysis2] = useState<any[]>([]);
  const [simpleAnalysis3, setSimpleAnalysis3] = useState<any[]>([]);
  const [complexAnalysis, setComplexAnalysis] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [xValue, setXValue] = useState<string>('');
  const [yValue, setYValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<VaccinationData | null>(null);

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

  const handleEdit = (rowData: VaccinationData) => {
    setIsEditing(true);
    setEditRow({ ...rowData });
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await axios.put(`https://localhost:7119/api/VaccinationData/${editRow!.id}`, editRow);
      const response = await axios.get<VaccinationData[]>('https://localhost:7119/api/VaccinationData');
      setVaccinationData(response.data);
      setEditRow(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://localhost:7119/api/VaccinationData/${id}`);
      const response = await axios.get<VaccinationData[]>('https://localhost:7119/api/VaccinationData');
      setVaccinationData(response.data);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
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
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Wyszukaj..."
            />
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
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {vaccinationData
                  .filter((item) => {
                    const searchString = searchValue.toLowerCase();
                    const id = item.id.toLowerCase();
                    const nazwaZmiennej = item.nazwa_zmiennej.toLowerCase();
                    const kraj = item.kraj.toLowerCase();
                    const rodzajChoroby = item.rodzaj_choroby.toLowerCase();
                    const czasTypSzczepienia = item.czas_typ_szczepienia.toLowerCase();
                    const typInformacji = item.typ_informacji_z_jednostka_miary.toLowerCase();
                    const rok = item.rok.toString().toLowerCase();
                    const wartosc = item.wartosc.toString().toLowerCase();
                    const zmienna = item.zmienna.toString().toLowerCase();
                    return (
                      id.includes(searchString) ||
                      nazwaZmiennej.includes(searchString) ||
                      kraj.includes(searchString) ||
                      rodzajChoroby.includes(searchString) ||
                      czasTypSzczepienia.includes(searchString) ||
                      typInformacji.includes(searchString) ||
                      rok.includes(searchString) ||
                      wartosc.includes(searchString) ||
                      zmienna.includes(searchString)
                    );
                  })
                  .map((data, index) => (
                    <tr key={data.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'transparent' }}>
                      <td>{data.id}</td>
                      <td>{data.nazwa_zmiennej}</td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <input
                            type="text"
                            value={editRow.kraj}
                            onChange={(e) => setEditRow({ ...editRow, kraj: e.target.value })}
                            style={{ maxWidth: '55px' }}
                          />
                        ) : (
                          data.kraj
                        )}
                      </td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <input
                            type="text"
                            value={editRow.rodzaj_choroby}
                            onChange={(e) => setEditRow({ ...editRow, rodzaj_choroby: e.target.value })}
                            style={{ maxWidth: '180px' }}
                          />
                        ) : (
                          data.rodzaj_choroby
                        )}
                      </td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <input
                            type="text"
                            value={editRow.czas_typ_szczepienia}
                            onChange={(e) => setEditRow({ ...editRow, czas_typ_szczepienia: e.target.value })}
                            style={{ maxWidth: '180px' }}
                          />
                        ) : (
                          data.czas_typ_szczepienia
                        )}
                      </td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <input
                            type="text"
                            value={editRow.typ_informacji_z_jednostka_miary}
                            onChange={(e) => setEditRow({ ...editRow, typ_informacji_z_jednostka_miary: e.target.value })}
                            style={{ maxWidth: '80px' }}
                          />
                        ) : (
                          data.typ_informacji_z_jednostka_miary
                        )}
                      </td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <input
                            type="text"
                            value={editRow.rok}
                            onChange={(e) => setEditRow({ ...editRow, rok: Number(e.target.value) })}
                            style={{ maxWidth: '45px' }}
                          />
                        ) : (
                          data.rok
                        )}
                      </td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <input
                            type="text"
                            value={editRow.wartosc}
                            onChange={(e) => setEditRow({ ...editRow, wartosc: Number(e.target.value) })}
                            style={{ maxWidth: '40px' }}
                          />
                        ) : (
                          data.wartosc
                        )}
                      </td>
                      <td>
                        {isEditing && editRow?.id === data.id ? (
                          <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(data)}>Edit</button>
                            <button onClick={() => handleDelete(data.id)}>Usuń</button>
                          </>
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
                <option value="">Choose X Value</option>
                <option value="id">ID</option>
                <option value="nazwa_zmiennej">Nazwa zmiennej</option>
                <option value="kraj">Kraj</option>
                <option value="rodzaj_choroby">Rodzaj choroby</option>
                <option value="czas_typ_szczepienia">Czas/typ szczepienia</option>
                <option value="typ_informacji_z_jednostka_miary">Typ informacji</option>
                <option value="rok">Rok</option>
                <option value="wartosc">Wartość</option>
                <option value="zmienna">Zmienna</option>
              </select>
            </div>
            <div>
              <label htmlFor="y-value">Y Value:</label>
              <select id="y-value" value={yValue} onChange={(e) => setYValue(e.target.value)}>
                <option value="">Choose Y Value</option>
                <option value="id">ID</option>
                <option value="nazwa_zmiennej">Nazwa zmiennej</option>
                <option value="kraj">Kraj</option>
                <option value="rodzaj_choroby">Rodzaj choroby</option>
                <option value="czas_typ_szczepienia">Czas/typ szczepienia</option>
                <option value="typ_informacji_z_jednostka_miary">Typ informacji</option>
                <option value="rok">Rok</option>
                <option value="wartosc">Wartość</option>
                <option value="zmienna">Zmienna</option>
              </select>
            </div>
            {xValue && yValue && (
              <div>
                <BarChart width={600} height={300} data={vaccinationData.map(data => ({ [xValue]: data[xValue], [yValue]: data[yValue] }))}>
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
