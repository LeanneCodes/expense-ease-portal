ExpenseEase: A Receipt Digitiser Web App
=========================

Overview
--------

The ExpenseEase is a cloud-based application that allows users to upload receipts and receive a digitised version via email. The application combines a user-friendly front-end interface built with Next.js with powerful AWS services for storage, text extraction, and email delivery. This project streamlines the process of converting physical receipts into digital records, making expense tracking easier and more efficient for users.

Users simply enter their email, upload one or more receipts (via drag-and-drop or file selection), and submit the form. Once submitted, the receipts are processed and sent back as a structured, formatted email.

Features
--------

*   **User-friendly interface:** Built with Next.js for smooth interactions and responsive design.
    
*   **Email validation and file upload requirement:** The "Submit" button is enabled only if a valid email and at least one file are provided.
    
*   **Flexible file upload:** Supports both drag-and-drop and click-to-upload functionality.
    
*   **Cloud storage:** Receipts are uploaded to an AWS S3 bucket for storage and processing.
    
*   **Automatic text extraction:** AWS Textract extracts relevant data from uploaded receipts.
    
*   **Formatted email delivery:** AWS Lambda formats extracted data and sends it to the user's email via Amazon SES.
    
*   **Front-end usability:** Designed for everyday users to digitise receipts without backend knowledge.
    

Screenshots
------------------

Homepage
![ExpenseEase](./public/expense-ease.jpg)

AWS S3 Bucket
![S3](./public/s3-bucket.png)

AWS CloudWatch
![CloudWatch](./public/cloudwatch.png)

Tech Stack
----------

*   **Frontend:** Next.js, React, Vercel
    
*   **Backend / Cloud Services:**
    
    *   AWS S3 (receipt storage)
        
    *   AWS Lambda (data formatting)
        
    *   Amazon Textract (text extraction)
        
    *   Amazon SES (email delivery)

    *   AWS CloudWatch (logs)
        
*   **Other:** JavaScript, HTML, CSS

Architecture Diagram
--------------------
![diagram](./public/expenseease-diagram.jpg)    

Purpose
-------

This project was developed to bridge the gap between cloud-based automation and user accessibility. While previous versions of similar projects focused on backend processing only, this version provides a fully interactive front-end for everyday users, eliminating the need for technical knowledge and enhancing usability.

What I Learned
--------------

*   Integrating AWS services (S3, Textract, Lambda, SES) with a Next.js front-end.
    
*   Handling file uploads and email validation in a React-based web app.
    
*   Coordinating asynchronous processes between the front end and serverless backend.
    
*   Formatting extracted data dynamically before sending via email.
    
*   Designing a user-friendly interface for non-technical users.
    

Future Development
------------------

*   **User authentication:** Implement login and registration functionality with role-based access (admin vs. regular user).
    
*   **Admin dashboard:** Allow administrators to view all uploaded receipts and manage data stored in a DynamoDB database.
    
*   **User dashboard:** Enable users to view all past and present uploaded receipts from their account.
    
*   **Enhanced receipt processing:** Support additional receipt formats, multi-page receipts, and advanced data validation.
    
*   **Notification system:** Option for real-time updates via email or push notifications.
    

How to Run Locally
------------------

1.  Clone the repository:git clone
    
2.  Navigate to the project directory:cd receipt-digitiser
    
3.  Install dependencies:npm install
    
4.  Set up environment variables for AWS credentials and services.
    
5.  Run the development server:npm run dev
    
6.  Open http://localhost:3000 in your browser.