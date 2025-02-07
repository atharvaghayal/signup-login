/* =============================== */
/* Updated server.js (Fixes Excel column issue & duplicate check) */
/* =============================== */

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

// Store OTPs temporarily
const otpStore = {};

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signup endpoint
app.post('/save-signup-data', async (req, res) => {
    const data = req.body;
    const fileName = 'SignupData.xlsx';

    if (await isDuplicateEntry(data, fileName)) {
        return res.json({ success: false, message: 'Data already registered. Try different credentials.' });
    }

    data.signupTimestamp = new Date().toLocaleString();
    saveToExcel(data, fileName);
    res.json({ success: true, message: 'Signup successful!' });
});

// Login endpoint
app.post('/save-login-data', async (req, res) => {
    const data = req.body;
    const fileName = 'SignupData.xlsx';
    const user = await validateUser(data, fileName);
    
    if (!user) {
        return res.json({ success: false, message: 'Invalid username or password' });
    }
    
    user.lastLoginTimestamp = new Date().toLocaleString();
    saveToExcel(user, fileName);
    res.json({ success: true, redirect: 'homepage.html' });
});

// OTP request
app.post('/request-otp', (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    otpStore[email] = otp;

    transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    });

    res.json({ success: true, message: 'OTP sent to your email' });
});

// Forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const newPassword = generateOTP();
    
    if (!(await updatePassword(email, newPassword, 'SignupData.xlsx'))) {
        return res.json({ success: false, message: 'Email not registered' });
    }

    transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        text: `Your new password is: ${newPassword}`
    });
    res.json({ success: true, message: 'Password reset successfully. Check your email.' });
});

async function isDuplicateEntry(data, fileName) {
    const workbook = new excelJS.Workbook();
    if (!fs.existsSync(fileName)) return false;
    await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet('Data');
    if (!worksheet) return false;
    const emails = worksheet.getColumn(3).values.slice(1); // Assuming email is in column 3
    return emails.includes(data.email);
}

async function validateUser(data, fileName) {
    const workbook = new excelJS.Workbook();
    if (!fs.existsSync(fileName)) return null;
    await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet('Data');
    if (!worksheet) return null;
    return worksheet.getRows().find(row => row.getCell(3).value === data.email && row.getCell(5).value === data.password);
}

async function updatePassword(email, newPassword, fileName) {
    const workbook = new excelJS.Workbook();
    if (!fs.existsSync(fileName)) return false;
    await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet('Data');
    if (!worksheet) return false;
    const row = worksheet.getRows().find(r => r.getCell(3).value === email);
    if (!row) return false;
    row.getCell(5).value = newPassword;
    await workbook.xlsx.writeFile(fileName);
    return true;
}

function saveToExcel(data, fileName) {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.getWorksheet('Data') || workbook.addWorksheet('Data');
    const columns = Object.keys(data).map((key) => ({ header: key, key }));
    worksheet.columns = columns;
    worksheet.addRow(data);
    workbook.xlsx.writeFile(fileName);
}

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
