# Expense Tracker Project Documentation

Welcome to the documentation for the Expense Tracker project built using Node.js. This documentation will guide you through the various features and functionalities of the project.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#1-introduction)
3. [Usage](#usage)
   - [User Registration](#user-registration)
   - [User Login](#user-login)
   - [Forgot Password](#forgot-password)
   - [Set New Password](#set-new-password)
   - [Edit Profile](#edit-profile)
   - [Expense Management](#expense-management)
     - [Add Expense](#add-expense)
     - [Edit Expense](#edit-expense)
     - [Delete Expense](#delete-expense)
     - [Search Expenses](#search-expenses)
   - [Category Management](#category-management)
     - [Create Category](#create-category)
   - [Expense Reminder](#expense-reminder)
4. [Middleware](#middleware)
5. [Logger](#logger)
6. [Validation](#validation)
7. [Conclusion](#conclusion)

## 1. Introduction <a name="introduction"></a>

The Expense Tracker project is designed to help users manage their expenses effectively. It provides features for user registration, login, password management, expense tracking, category creation, and expense reminders. The project is built using Node.js and incorporates middleware for enhanced security, a logger for efficient debugging, and validation to ensure data integrity.

## 2. Installation <a name="installation"></a>

1. Clone the repository: `git clone https://github.com/ishansingh1010/Expense-Tracker`
2. Navigate to the project directory: `cd expense-tracker`
3. Install dependencies: `npm install`
4. Configure environment variables (e.g., database connection, email service credentials).
5. Start the application: `npm start`

## 3. Usage <a name="usage"></a>

### User Registration <a name="user-registration"></a>

Users can create an account by providing necessary information such as name, email, and password.

### User Login <a name="user-login"></a>

Users can log in using their registered email and password.

### Forgot Password <a name="forgot-password"></a>

Users who forget their passwords can initiate a password reset process. An email will be sent to their registered email address with a reset link.

### Set New Password <a name="set-new-password"></a>

After clicking the reset link from the email, users can set a new password for their account.

### Edit Profile <a name="edit-profile"></a>

Users can modify their profile details like name, email, and password.

### Expense Management <a name="expense-management"></a>

#### Add Expense <a name="add-expense"></a>

Users can add details of a new expense including the amount, date, category, and description.

#### Edit Expense <a name="edit-expense"></a>

Users can edit details of an existing expense, such as updating the amount, date, category, or description.

#### Delete Expense <a name="delete-expense"></a>

Users can delete a specific expense entry.

#### Search Expenses <a name="search-expenses"></a>

Users can search for expenses based on date, category, and expense name.

### Category Management <a name="category-management"></a>

#### Create Category <a name="create-category"></a>

Users can create categories to better organize their expenses.

### Expense Reminder <a name="expense-reminder"></a>

Users can set reminders for expenses, and the system will send reminder emails at specified intervals.

## 4. Middleware <a name="middleware"></a>

Middleware functions have been implemented to enhance security and manage user sessions.

## 5. Logger <a name="logger"></a>

A logging mechanism is integrated to track application activities and assist in debugging.

## 6. Validation <a name="validation"></a>

Input data is validated to ensure accuracy and prevent malicious inputs from compromising the system.

## 7. Conclusion <a name="conclusion"></a>

The Expense Tracker project provides users with a comprehensive platform to manage their expenses efficiently. With features such as user registration, expense tracking, password management, and reminders, this project serves as a useful tool for personal finance management.
