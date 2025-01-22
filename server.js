const express = require('express');
const bodyParser = require('body-parser');
const excelJS = require('exceljs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-signup-data', (req, res) => {
    saveToExcel(req.body, 'SignupData.xlsx');
    res.send('Signup data saved!');
});

app.post('/save-login-data', (req, res) => {
    saveToExcel(req.body, 'LoginData.xlsx');
    res.send('Login data saved!');
});

function saveToExcel(data, fileName) {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    const columns = Object.keys(data).map((key) => ({ header: key, key }));
    worksheet.columns = columns;

    worksheet.addRow(data);

    workbook.xlsx.writeFile(fileName).then(() => console.log(`${fileName} saved!`));
}

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
