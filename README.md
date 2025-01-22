# Signup and Login Page with Microsoft Excel Integration

## Project Overview

This project implements a fully working **Signup** and **Login** page for a web application. The user data (f_name,l_name,age,phone number,username, email, and password(encrypted & decrypted) is stored in a **Microsoft Excel spreadsheet** for simplicity and ease of management. The application allows new users to register and existing users to log in. The backend functionality is designed to handle the saving of user data securely and check for user credentials during login.

## UNDER DEVELOPMENT..!!
![image](https://github.com/user-attachments/assets/018a9502-35af-4c34-a61d-4b3faccc66f5)
![image](https://github.com/user-attachments/assets/5fa0026c-e4f1-4d2f-b0c3-a27fba2e23c4)

## Pending Tasks..
1. Signup with google & Signup with Github..
2. Connecting signup and login pages.
3. Conditional formatting in excel spreadsheets.

### Features

- **Signup Page**: Allows new users to create an account by providing their respective details.
- **Login Page**: Allows registered users to log in using their user_id and password.
- **Microsoft Excel Integration**: User data is stored in an Excel spreadsheet (`SignupData.xlsx`), which is easy to update and manage.
- **Secure Authentication**: Basic validation and matching of credentials to ensure secure access.

### Technologies Used

- **Frontend**: HTML,CSS,JS
- **Backend**: server.js(Node package manager)
- **Database**: Microsoft Excel Spreadsheet (`SignupData.xlsx`)(`LoginData.xlsx`)

### How It Works

1. **Signup Process**: 
   - The user enters their details in the signup form.
   - The data is stored in the Excel file (`SignupData.xlsx`) under columns: `First name`,`Last name`,`Age`,`Phone number`,`Username`, `Email`, and `Password`.
   
2. **Login Process**: 
   - The user enters their username/email and password in the login form.
   - The application checks the data in the Excel file to authenticate the user.

### Installation

To get this project running locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/signup-login-excel.git
