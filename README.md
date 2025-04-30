# E-Wallet API

## Description

This project is a simulation of a digital wallet (e-wallet) system that supports core financial features such as deposits, withdrawals, balance checks, and money transfers between accounts. It is designed to demonstrate best practices in backend development, including:

- Designing and modeling a relational database using Prisma ORM  
- Implementing a modular and clean RESTful API  
- Writing well-structured, reusable, and maintainable TypeScript code  
- Creating clear documentation and maintaining descriptive Git commit history  

The project focuses on building a scalable and maintainable backend system for managing financial transactions efficiently.


---

## 🚀 Tech Stack

- **Node.js** & **Express.js**
- **TypeScript**
- **Prisma ORM** with PostgreSQL
- **Yup** for request validation
- **Jest** for testing

---

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 8.x or yarn >= 1.22
- PostgreSQL database


---

## 🔧 Docker Installation (Dev Environment)

1. Clone the repo:
   ```bash
   git clone https://github.com/andarpratama/nufaza-ewallet-test
   cd nufaza-ewallet-test
   ```
2. Create a `.env` in project root (Or Copas `.env.example`):
   ```dotenv
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   NODE_ENV=production
   PORT=3000
   ```
3. Build & Run with Docker:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```
---
## 🔧 Docker Installation (Prod Environment)

1. Clone the repo:
   ```bash
   git clone https://github.com/andarpratama/nufaza-ewallet-test
   cd nufaza-ewallet-test
   ```
2. Create a `.env` in project root (Or Copas `.env.example`):
   ```dotenv
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   NODE_ENV=production
   PORT=3000
   ```
3. Build & Run with Docker:
   ```bash
   docker compose up --build
   ```
---

## 🔧 Manually Installation 

1. Clone the repo:
   ```bash
   git clone https://github.com/andarpratama/nufaza-ewallet-test
   cd nufaza-ewallet-test
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` in project root (Or Copas `.env.example`):
   ```dotenv
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   NODE_ENV=production
   PORT=3000
   ```
4. Generate Prisma client and apply migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

---


## ⚙️ Running the App

- **Development**:
  ```bash
  npm run dev        # starts `ts-node` with nodemon
  ```
- **Production**:
  ```bash
  npm run build      # compiles TS to JS
  npm start          # runs compiled code
  ```

---

## 📐 Project Structure
```
src
├── __tests__
│   ├── add-deposit.test.ts
│   ├── app.test.ts
│   ├── check-balance.test.ts
│   ├── example.test.ts
│   ├── register.test.ts
│   ├── transaction.test.ts
│   ├── transfer.controller.test.ts
│   └── withdraw.test.ts
├── app
│   ├── account
│   │   ├── account.controller.ts
│   │   ├── account.route.ts
│   │   ├── account.service.ts
│   │   ├── account.types.ts
│   │   └── account.validator.ts
│   └── register
│       ├── register.controller.ts
│       ├── register.route.ts
│       ├── register.service.ts
│       └── register.validator.ts
├── app.ts
├── errors
│   ├── AppError.ts
│   └── errorTypes.ts
├── main.ts
├── middleware
│   └── errorHandler.ts
├── prisma.ts
├── routes
│   └── index.ts
└── utils
```


---

## 🔍 API Endpoints

| Method | Endpoint                         | Description                    |
|--------|----------------------------------|--------------------------------|
| POST   | `/accounts`                      | Register a new user            |
| GET    | `/accounts/:id/balance`          | Get user balance               |
| POST   | `/accounts/:id/deposit`          | Deposit funds                  |
| POST   | `/accounts/:id/withdraw`         | Withdraw funds                 |
| POST   | `/accounts/:id/transfer`         | Transfer funds between users   |
| GET    | `/accounts/:id/transactions`     | Get transaction history        |

### Request & Response Examples

#### Register
```http
POST /accounts
Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com" }
```
```json
HTTP/1.1 201 Created
{ "id": 1, "name": "Alice", "email": "alice@example.com", "balance": 0 }
```

#### Deposit
```http
POST /accounts/1/deposit
Content-Type: application/json

{ "amount": 100 }
```
```json
HTTP/1.1 200 OK
{ "balance": 100 }
```

#### Withdraw (falsy amount returns current state)
```http
POST /accounts/1/withdraw
Content-Type: application/json

{ "amount": 0 }
```
```json
HTTP/1.1 200 OK
{ "id": 1, "balance": 100 }
```

#### Transfer
```http
POST /accounts/1/transfer
Content-Type: application/json

{ "toAccountId": 2, "amount": 50 }
```
```json
HTTP/1.1 200 OK
{ "fromBalance": 50, "toBalance": 150 }
```

#### Transactions History
```http
GET /accounts/1/transactions
```
```json
HTTP/1.1 200 OK
[
  { "id": 3, "type": "DEPOSIT", "amount": 100, "createdAt": "2025-04-30T...Z" },
  { "id": 2, "type": "WITHDRAW", "amount": 50, "createdAt": "2025-04-29T...Z" }
]
```

---

## 🧪 Testing

Run unit tests with Jest:
```bash
npm test
```

