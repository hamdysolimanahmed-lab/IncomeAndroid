/**
 * Google Apps Script Backend for IncomeWeb
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Rename the first sheet to "sheet1" (or update SHEET_NAME below).
 * 3. Add headers in row 1: transaction_date, payer, description, amount, mo, yr, pdf
 * 4. Extensions > Apps Script.
 * 5. Paste this code into Code.gs.
 * 6. Click "Deploy" > "New deployment".
 * 7. Select type: "Web app".
 * 8. Description: "v1".
 * 9. Execute as: "Me".
 * 10. Who has access: "Anyone" (IMPORTANT for public read access without OAuth).
 * 11. Click "Deploy".
 * 12. Copy the "Web App URL" and paste it into the frontend configuration.
 */

const SHEET_NAME = 'sheet1';

function doGet(e) {
    return handleRequest(e);
}

function handleRequest(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = getSheetData();
        return createJSONOutput(data);
    } catch (err) {
        return createJSONOutput({ error: err.toString() });
    } finally {
        lock.releaseLock();
    }
}

function getSheetData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        throw new Error(`Sheet "${SHEET_NAME}" not found.`);
    }

    const range = sheet.getDataRange();
    const values = range.getDisplayValues(); // Get values as strings to preserve formatting initially

    if (values.length < 1) {
        return { headers: [], rows: [] };
    }

    const headers = values[0];
    const rawRows = values.slice(1);

    const rows = rawRows.map(row => {
        const rowObj = {};

        headers.forEach((header, index) => {
            // Basic field mapping
            rowObj[header] = row[index];
        });

        // Enhanced parsing
        // 1. Transaction Date
        const dateStr = rowObj['transaction_date'];
        if (dateStr) {
            rowObj['transaction_date_raw'] = dateStr;
            rowObj['transaction_date_iso'] = parseDateToISO(dateStr);
        }

        // 2. Amount
        const amountStr = rowObj['amount'];
        if (amountStr) {
            rowObj['amount_value'] = parseAmount(amountStr);
        }

        return rowObj;
    });

    return {
        headers: headers,
        rows: rows
    };
}

function parseDateToISO(dateStr) {
    // Expecting MM/DD/YYYY
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return dateStr; // Fallback
}

function parseAmount(amountStr) {
    // Remove '$', ',', and whitespace
    if (!amountStr) return 0;
    const cleanStr = amountStr.replace(/[$,\s]/g, '');
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
}

function createJSONOutput(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
