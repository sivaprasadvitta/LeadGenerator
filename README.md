# Simple Lead Generation System

A lightweight system to collect leads via a web form, forward them to an automation workflow, and send email notifications and stores data into google form.

---

## Features

1. **Frontend (Vue/React + Tailwind CSS)**  
   - A clean form to collect:
     - Name (required)
     - Email (required, valid format)
     - Company (optional)
     - Message (optional)
   - Client‐side validation before submitting.

2. **Backend (Node.js + Express)**  
   - An API endpoint (`POST /api/leads`) that:
     - Validates incoming data (ensures name and valid email, limits company/message length).
     - Forwards the JSON payload to an n8n webhook URL.

3. **n8n Workflow Automation**  
   - A Webhook node that listens for new leads.
   - A Send Email node (SendGrid/Mailgun/SMTP) that sends lead details to the sales team.
   - A storage node (Google Sheets) to save each lead record.

---

## Prerequisites

- **Node.js** (v16 or higher)  
- **npm** (v8 or higher)  
- **n8n** (self-hosted or n8n Cloud account)  
- **SendGrid/Mailgun/SMTP** credentials for sending email notifications

---
## Setup Instructions

### 1.Clone the git repo

git clone https://github.com/sivaprasadvitta/LeadGenerator.git

## 2. Backend

1. Open a terminal:
2. Install dependencies:npm install
3. Create a `.env` file :
4. N8N_WEBHOOK_URL=https://<your-n8n-host>/webhook/lead-webhook
5. npm start
By default, the server listens on `http://localhost:3000`.

---

### 2. Frontend

1. Open a new terminal and navigate into the `frontend/` folder:
2. Install dependencies:npm install
3. Start the development server:npm run dev

By default, the frontend is available at `http://localhost:5173` (Vite)

---

### 3. n8n Workflow

1. Open your n8n instance (e.g., `https://your-n8n-host`).

2. Create a new workflow and import `n8n/lead-workflow.json`, or manually add:
- **Webhook** node:
  - Path: `lead-webhook`
  - HTTP Method: `POST`
- **Send Email** node (SendGrid/Mailgun/SMTP):
  - From: your “no-reply” address
  - To: sales team email (e.g., `sales@company.com`)
  - Subject/Body: use expressions like `{{$json.name}}`, `{{$json.email}}`, etc.

3. (Optional) Add a storage node (Google Sheets, Airtable, or MySQL) to log leads.

4. Activate the workflow so that n8n will respond to incoming HTTP requests on `/webhook/lead-webhook`.

---

## How It Works

1. **User submits** the form on the frontend (`/`), which POSTs to `http:localhost:3000/api/leads`.
2. **Backend `/api/leads`** route:
- Reads `name`, `email`, `company`, `message` from `req.body`.
- Runs server-side validation:
  - `name` must be a non-empty string.
  - `email` must match a simple email regex.
  - If provided, `company` ≤ 100 characters; `message` ≤ 500 characters.
- If validation fails → responds with `400 Bad Request` + error message.
- If validation succeeds → forwards the payload to `N8N_WEBHOOK_URL` via `axios.post(...)`.
- Returns `200 OK` to the frontend if n8n returns a 2xx response; otherwise `502 Bad Gateway`.

3. **n8n Webhook** node:
- Receives the JSON payload from the backend.
- Immediately triggers the connected **Send Email** node and in parallel it stores data in google sheets 
- Send Email node uses templating like:
  ```
  Subject: New Lead from {{$json.name}}
  Body:
    Name: {{$json.name}}
    Email: {{$json.email}}
    Company: {{$json.company}}
    Message: {{$json.message}}
  ```
- (Optional) Storage node appends a new row in Google Sheets or Airtable with the lead data.

4. **Sales team** receives an email notification with the lead details.  
(If storage is configured, the lead is also logged for future reference.)

---

## Future Extensions

- **CRM Integration**: Add a node in n8n to push leads into  custom MySQL/PostgreSQL.
- **Lead Scoring**: Insert a Function node in n8n to calculate a score (e.g., based on form answers or UTM source) before sending or storing.
- **Slack/Teams Notifications**: Add a “Post to Slack” or “Post to Microsoft Teams” node after the Send Email node.
- **User Confirmation Email**: Chain another Send Email node to send a “Thank you” message back to the lead’s email.

---

## License

MIT License. Feel free to use and modify as needed.




