/**
 * Generate and download registration receipt as HTML
 */
export const downloadReceipt = (registrationData, eventData) => {
  const {
    fullName,
    email,
    phone,
    instituteName,
    teamName,
    transactionId,
    uniqueRegistrationId,
    amountExpected,
    createdAt
  } = registrationData;

  const receiptHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Receipt - Aavhaan 2026</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-center;
    }
    .receipt {
      background: white;
      max-width: 600px;
      width: 100%;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .success-badge {
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      display: inline-block;
      margin: 20px 0;
      font-weight: 600;
      font-size: 14px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 2px dashed #e5e7eb;
    }
    .section:last-child {
      border-bottom: none;
    }
    .section-title {
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .info-label {
      color: #6b7280;
      font-size: 14px;
    }
    .info-value {
      color: #111827;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
    }
    .highlight {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .registration-id {
      font-size: 24px;
      color: #667eea;
      font-weight: 700;
      text-align: center;
      letter-spacing: 2px;
      padding: 16px;
      background: #f3f4f6;
      border-radius: 8px;
      margin: 16px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer strong {
      color: #111827;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .receipt {
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>AAVHAAN 2026</h1>
      <p>Shri Ram Institute of Science and Technology, Jabalpur</p>
      <div class="success-badge">✓ Registration Successful</div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">Registration ID</div>
        <div class="registration-id">${uniqueRegistrationId || 'PENDING'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Event Details</div>
        <div class="info-row">
          <span class="info-label">Event Name</span>
          <span class="info-value">${eventData?.title || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Event Day</span>
          <span class="info-value">${eventData?.day || 'N/A'}</span>
        </div>
        ${teamName ? `
        <div class="info-row">
          <span class="info-label">Team Name</span>
          <span class="info-value">${teamName}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Participant Details</div>
        <div class="info-row">
          <span class="info-label">Name</span>
          <span class="info-value">${fullName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">${phone}</span>
        </div>
        <div class="info-row">
          <span class="info-label">College</span>
          <span class="info-value">${instituteName}</span>
        </div>
      </div>
      
      ${amountExpected > 0 ? `
      <div class="section">
        <div class="section-title">Payment Details</div>
        <div class="info-row">
          <span class="info-label">Entry Fee</span>
          <span class="info-value">₹${amountExpected}</span>
        </div>
        ${transactionId ? `
        <div class="info-row">
          <span class="info-label">Transaction ID</span>
          <span class="info-value">${transactionId}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Payment Status</span>
          <span class="info-value" style="color: #f59e0b;">Pending Verification</span>
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Registration Date</div>
        <div class="info-row">
          <span class="info-label">Submitted On</span>
          <span class="info-value">${new Date(createdAt || Date.now()).toLocaleString()}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Important:</strong> Please save this receipt for your records.</p>
      <p>You will receive a confirmation email shortly with further details.</p>
      <p>For queries, contact: support@aavhaan2026.com</p>
      <p style="margin-top: 12px;">© 2026 Aavhaan - All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create a Blob and download
  const blob = new Blob([receiptHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Aavhaan_2026_Receipt_${uniqueRegistrationId || Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
