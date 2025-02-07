const express = require('express');
const bodyParser = require('body-parser');
const excelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email transport setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with actual email
        pass: 'your-email-password'  // Replace with actual password
    }
});

// Signup endpoint
app.post('/save-signup-data', async (req, res) => {
    const data = req.body;
    const fileName = 'SignupData.xlsx';

    if (await isDuplicateEntry(data, fileName)) {
        return res.json({ success: false, message: 'Data already registered. Try different credentials.' });
    }

    data.signupTimestamp = new Date().toLocaleString();
    await saveToExcel(data, fileName);
    res.json({ success: true, message: 'Signup successful!' });
});

// Login endpoint (Fix: Correct row lookup and authentication check)
app.post('/save-login-data', async (req, res) => {
    const data = req.body;
    const fileName = 'SignupData.xlsx';
    const workbook = new excelJS.Workbook();

    if (!fs.existsSync(fileName)) return res.json({ success: false, message: 'User not found' });
    await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet('Data');
    if (!worksheet) return res.json({ success: false, message: 'Data not found' });

    // Find the user in the worksheet
    let userFound = false;
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
            const usernameCell = row.getCell(6).value; // Username column
            const passwordCell = row.getCell(7).value; // Password column
            if (usernameCell === data.username && passwordCell === data.password) {
                userFound = true;
                row.getCell(9).value = new Date().toLocaleString(); // Update last login timestamp
            }
        }
    });

    if (!userFound) {
        return res.json({ success: false, message: 'Invalid username or password' });
    }

    await workbook.xlsx.writeFile(fileName);
    res.json({ success: true, redirect: 'homepage.html' });
});

async function isDuplicateEntry(data, fileName) {
    const workbook = new excelJS.Workbook();
    if (!fs.existsSync(fileName)) return false;
    await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet('Data');
    if (!worksheet) return false;
    let duplicateFound = false;
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1 && row.getCell(3).value === data.email) {
            duplicateFound = true;
        }
    });
    return duplicateFound;
}

async function saveToExcel(data, fileName) {
    const workbook = new excelJS.Workbook();
    let worksheet;
    if (fs.existsSync(fileName)) {
        await workbook.xlsx.readFile(fileName);
        worksheet = workbook.getWorksheet('Data');
    } else {
        worksheet = workbook.addWorksheet('Data');
        worksheet.columns = Object.keys(data).map((key) => ({ header: key, key }));
    }
    worksheet.addRow(data);
    await workbook.xlsx.writeFile(fileName);
}
// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
