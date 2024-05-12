import axios from "axios";
import React, { useState, useEffect } from "react";
import "../components/css/queryBuilder.css";
interface ApiData {
  Name: string;
  Value: any;
}

interface CollectionsNames {
  name: string;
}

interface ApiResponse {
  collumnName: string;
  collumnType: string; // lub odpowiedni typ dla wartości
}

interface filters {
  filter: ApiResponse[];
  operatorType: string
}

interface QueryFilter {
  ColumnName: string;
  InputName: string;
  FilterType: string;
  Operator: string | number;
  Type: string;
  Index: string;
}
const QueryBuilder: React.FC = () => {
  const [collectionsNamesData, setCollectionsNamesData] = useState<string[]>(
    []
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [columns, setColumns] = useState<filters[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnsNames, setColumnsNames] = useState<ApiResponse[]>([]);
  const [queryFilter, setQueryFilter] = useState<QueryFilter[]>([]);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [queryResultsHeader, setQueryResultsHeader] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<string[]>(
          "https://localhost:7119/api/QueryBuilder/collectionsnames"
        );
        setCollectionsNamesData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching collectionsNames data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Tutaj wykonujemy zapytanie do endpointa po zmianie opcji
    axios
      .get<ApiResponse[]>(
        `https://localhost:7119/api/QueryBuilder/${selectedValue}/columns`
      )
      .then((response) => {
        // Przyjmując, że odpowiedź zawiera tablicę nazw kolumn
        const filte: filters[] = [{ filter: response.data, operatorType: "$and" }];
        setColumnsNames(response.data);
        setColumns(filte);
        console.log(columns);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania kolumn:", error);
      });
  };

  const handleAddQueryFilter = (
    columnName: string,
    filterType: string,
    operator: string,
    type: string,
    index :string
  ) => {
    setSelectedColumns((prevSelectedColumns) => [
      ...prevSelectedColumns,
      columnName+index,
    ]);

    setQueryFilter((prevFilters) => {
      const existingFilterIndex = prevFilters.findIndex(
        (filter) => filter.InputName === columnName+index
      );

      if (existingFilterIndex !== -1) {
        // Jeśli obiekt z takim CollumnName już istnieje, zaktualizuj jego wartości
        const updatedFilters = [...prevFilters];
        updatedFilters[existingFilterIndex] = {
          ColumnName: columnName,
          InputName:columnName+index,
          FilterType: filterType,
          Operator: operator,
          Type: type,
          Index: index
        };
        return updatedFilters;
      } else {
        // W przeciwnym razie, dodaj nowy obiekt QueryFilter
        const newFilter: QueryFilter = {
          ColumnName: columnName,
          FilterType: filterType,
          InputName:columnName+index,
          Operator: operator,
          Type: type,
          Index: index
        };
        return [...prevFilters, newFilter];
      }
    });
  };

  const handleRemoveQueryFilter = (columnName: string,index:string) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.filter((item) => item !== columnName+index)
    );
    setQueryFilter((prevFilters) =>
      prevFilters.filter((filter) => filter.ColumnName !== columnName+index)
    );
  };

  const handleExecuteClick = () => {
    const data = {
      collectionName: selectedOption,
      filterConditions: queryFilter,
    };
    data.filterConditions.sort((a, b) => parseInt(a.Index) - parseInt(b.Index));
    const indexedArrays:any = [];

    // Iteracja przez wszystkie elementy
    data.filterConditions.forEach(element => {
        const index = element.Index;
        // Sprawdź, czy tablica dla danego indeksu istnieje
        if (!indexedArrays[index]) {
            indexedArrays[index] = []; // Jeśli nie, utwórz nową tablicę
        }
        indexedArrays[index].push(element); // Dodaj element do odpowiedniej tablicy
    });
    
    //console.log(indexedArrays);
    const data2 = {
      collectionName: selectedOption,
      filterConditions:indexedArrays
    }
    debugger;
    const endpoint = `https://localhost:7119/api/QueryBuilder/${selectedOption}/data/${JSON.stringify(
      queryFilter
    )}`;

    axios
      .post(endpoint, data2)
      .then((response) => {
        setQueryResultsHeader([response.data[0]]);
        setQueryResults(response.data);
        //setApiData(response.data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych:", error);
      });
  };

  const handleNewColumnFilterClick = () => {
    const newFilter: filters = { filter: columnsNames, operatorType: "$and" };
    setColumns(prevState => [...prevState, newFilter]);
  }

  return (
    <>
      <div className="QueryBuilderTool">
        <div className="toolSection">
          <label>Nazwa kolekcji:</label>
          <br></br>
          <select onChange={handleChange}>
            {collectionsNamesData.map((collectionsName, index) => (
              <option key={index}>{collectionsName}</option>
            ))}
          </select>
        </div>
        <div className="toolSection">
          Pola w wybranej kolekcji
          <div className="filtersList">
            {columns.map((column,index) => (
              <span >
                {
                   column.filter.map((col:ApiResponse)=>(
                <div key={col.collumnName}>
                  <span
                    onClick={() => {
                      if (selectedColumns.includes(col.collumnName+index.toString())) {
                        handleRemoveQueryFilter(col.collumnName,index.toString());
                      } else {
                        handleAddQueryFilter(
                          col.collumnName,
                          "gt",
                          "",
                          col.collumnType,
                          index.toString()
                        );
                      }
                    }}
                    style={{
                      backgroundColor: selectedColumns.includes(
                        col.collumnName+index.toString()
                      )
                        ? "red"
                        : "transparent",
                    }}
                  >
                    {col.collumnName}
                  </span>
                  <span>
                    <select
                      disabled={!selectedColumns.includes(col.collumnName+index.toString())}
                      name={"type" + col.collumnName+index.toString()}
                      id={"type" + col.collumnName+index.toString()}
                      onChange={(e) => {
                        const filterType = e.target.value;
                        handleAddQueryFilter(
                          col.collumnName,
                          filterType,
                          "",
                          col.collumnType,
                          index.toString()
                        );
                      }}
                    >
                      <option value="gt">Większe od</option>
                      <option value="lt">Mniejsze od</option>
                      <option value="eq">Równe</option>
                      <option value="ne">Różne</option>
                    </select>
                  </span>
                  <span>
                    <input
                      disabled={!selectedColumns.includes(col.collumnName+index.toString())}
                      type={col.collumnType}
                      name={"column" + col.collumnName+index.toString()}
                      id={"column" + col.collumnName+index.toString()}
                      onChange={(e) => {
                        const operator = e.target.value;
                        const selectElement = document.getElementById(
                          `type${col.collumnName+index.toString()}`
                        ) as HTMLSelectElement;
                        const filterType = selectElement.value || "gt";
                        handleAddQueryFilter(
                          col.collumnName,
                          filterType,
                          operator,
                          col.collumnType,
                          index.toString()
                        );
                      }}
                    />
                  </span>
                 
                </div>
                ))
                }
              </span>
             
              )
            )}
          </div>
                 <div  onClick={handleNewColumnFilterClick}>
                    Dodaj nową kolumnę 
                  </div>
        </div>
      </div>
      <>
        <div>
          <div onClick={handleExecuteClick}>Pobierz dane</div>
          <h2>Dane z API:</h2>
          <ul>
            <div>
              <table>
                <thead>
                  <tr>
                    {queryResultsHeader.map((obj, index) =>
                      Object.keys(obj).map((key, innerIndex) => {
                        return (
                          <td key={index + "_" + innerIndex}>
                            {obj[key].Name} {obj[key].Value}
                          </td>
                        );
                      })
                    )}
                  </tr>
                </thead>
                <tbody>
                  {queryResults.map((obj, index) => (
                    <tr key={index}>
                      {Object.keys(obj).map((key, innerIndex) => {
                        return (
                          <td key={index + "_" + innerIndex}>
                            {obj[key].Value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
             
            </div>
          </ul>
        </div>
      </>
    </>
  );
};

export default QueryBuilder;
