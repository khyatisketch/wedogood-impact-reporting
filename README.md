WeDoGood – Impact Reporting Platform

A scalable web application that allows NGOs to submit monthly impact reports (individually or via CSV upload) and enables admins to track aggregated impact metrics through a dashboard.
Designed to handle async processing, partial failures, and idempotent data ingestion.

Tech Stack
Frontend

React (Vite)

JavaScript

Fetch API

Basic CSS (inline / minimal styling)

Backend

Node.js

Express.js

PostgreSQL

pg (node-postgres)

csv-parser

UUID

Infrastructure

Backend: Render

Database: Render PostgreSQL

Frontend: Vercel

Architecture Overview
Frontend (React)
   |
   | HTTP API (REST)
   v
Backend (Express)
   ├── Routes
   ├── Controllers
   ├── Services
   ├── Utils (CSV parsing, validation)
   └── PostgreSQL
        ├── reports
        └── jobs

High-level flow

Frontend submits reports or CSV files

Backend validates and processes requests

CSV uploads are processed asynchronously

Job progress is tracked in the database

Admin dashboard queries aggregated data

Database Schema
reports

Stores monthly NGO impact data

Enforces idempotency using a unique constraint

UNIQUE (ngo_id, month)

jobs

Tracks async CSV upload progress

Stores:

total rows

processed rows

failed rows

job status

How Async CSV Processing Works

User uploads a CSV file

Backend creates a job entry with status PENDING

CSV is parsed in memory

Rows are processed one-by-one in the background

Job progress (processed_rows, failed_rows) is updated after each row

Job status is marked COMPLETED or FAILED

This ensures:

Non-blocking API responses

Progress visibility

Resilience to partial failures

How Idempotency Is Handled

The reports table has a unique constraint on (ngo_id, month)

If a duplicate report is inserted:

PostgreSQL raises a constraint error

That row is counted as failed

Processing continues for remaining rows

This prevents:

Double-counting

Data corruption

Inconsistent aggregations

How Partial Failures Are Handled

Each CSV row is validated before DB insertion:

Required fields are checked

Numeric fields are validated to reject NaN

Invalid rows are skipped and counted as failures

Failures do not stop the job.
Final job status reflects accurate counts:

processed_rows + failed_rows = total_rows

API Endpoints
Submit Single Report
POST /api/report

Upload CSV (Async)
POST /api/reports/upload

Get Job Status
GET /api/job-status/:job_id

Admin Dashboard
GET /api/dashboard?month=YYYY-MM

How to Run Locally
Backend
cd backend
npm install
npm run dev


Environment variables:

PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name

Frontend
cd frontend
npm install
npm run dev


Frontend .env:

VITE_API_BASE_URL=http://localhost:4000/api

Deployed Links

Frontend: https://<your-vercel-url>

Backend API: https://wedogood-impact-reporting.onrender.com/api

Health Check: https://wedogood-impact-reporting.onrender.com/api/health

What I’d Improve With More Time

Add DB migrations (Prisma / Knex)

Persist row-level failure reasons

Add authentication for admin routes

Use a message queue (BullMQ / SQS) for CSV processing

Add pagination and filters to dashboard

Improve frontend UX and error handling

Notes

The system is designed for correctness, scalability, and resilience

Emphasis was placed on data integrity, async workflows, and clear architecture