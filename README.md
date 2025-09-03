# 🏫 School Information Management – Web Development Assignment

## Link to the School Portal : 
https://school-portal-wdx7.vercel.app/




## 📌 Project Summary
This is a mini-project built using **Next.js** (React framework) and **MySQL**.  
It consists of **two responsive pages**:
1. **Add School Page** – to input and store school details in the database.
2. **Show Schools Page** – to fetch and display the stored schools in a card/grid layout.

---

## 📂 MySQL Table Structure

**Table Name:** `schools`

| Field Name | Type            | Description                              |
|------------|-----------------|------------------------------------------|
| id         | INT (AUTO_INCREMENT) | Primary key, unique ID for each school |
| name       | TEXT            | Name of the school                       |
| address    | TEXT            | Full address of the school               |
| city       | TEXT            | City where the school is located         |
| state      | TEXT            | State where the school is located        |
| contact    | NUMBER          | Contact number (10–15 digits)            |
| image      | TEXT            | Path/filename of the school image        |
| email_id   | TEXT            | Email address of the school              |

---

## 📄 Pages

### 1️⃣ `addSchool.jsx`
- Built using **Next.js** and **react-hook-form**.
- Allows users to enter:
  - School Name
  - Email Address (with validation)
  - Address
  - City
  - State
  - Contact Number (10–15 digits)
  - School Image (stored in `/schoolImages` folder)
- Validations:
  - Required fields
  - Email format check
  - Contact number length check
- Responsive design for **desktop** and **mobile**.

---

### 2️⃣ `showSchools.jsx`
- Fetches data from the `schools` table.
- Displays:
  - School Name
  - Address
  - City
  - Image
- Layout inspired by **e-commerce product cards**.
- Fully responsive for **desktop** and **mobile**.
- Reference design: [Uniform App School Search](https://uniformapp.in/schoolsearch.php)

---



## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KrishnaChhetry/School-Portal.git
   cd school-info-app

2. http://localhost:3000/addSchool
   http://localhost:3000/showSchools
