module.exports = {
    input: ['./src/**/*.tsx', './src/**/*.ts'], // Ścieżki do plików źródłowych
    output: './public/locales/$LOCALE/$NAMESPACE.json', // Ścieżka do generowanych plików tłumaczeń
    locales: ['en', 'pl', 'es'], // Lista obsługiwanych języków
    namespaceSeparator: false, // Separator między nazwami przestrzeni nazw
    keySeparator: '.', // Separator między kluczami tłumaczeń
    defaultValue: '', // Domyślna wartość, jeśli klucz nie ma tłumaczenia
    useKeysAsDefaultValue: false, // Użyj kluczy jako domyślnej wartości, jeśli nie ma tłumaczenia
  };
  