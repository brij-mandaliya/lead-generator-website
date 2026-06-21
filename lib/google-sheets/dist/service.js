import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
// Initialize Google Sheets client
let sheetsClient = null;
let authClient;
/**
 * Initialize Google Sheets service with service account credentials
 */
export async function initializeGoogleSheetsService() {
    try {
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountEmail || !serviceAccountKey) {
            throw new Error('Google service account credentials not configured');
        }
        // Parse the key if it's a JSON string
        const key = typeof serviceAccountKey === 'string'
            ? JSON.parse(serviceAccountKey)
            : serviceAccountKey;
        authClient = new JWT({
            email: serviceAccountEmail,
            key: key.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        // Authorize the client
        await authClient.authorize();
        // Initialize Sheets API client
        sheetsClient = google.sheets({
            version: 'v4',
            auth: authClient,
        });
        console.log('Google Sheets service initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize Google Sheets service:', error);
        throw error;
    }
}
/**
 * Create a new Google Sheet with a title
 */
export async function createGoogleSheet(title) {
    if (!sheetsClient) {
        throw new Error('Google Sheets service not initialized');
    }
    try {
        const resource = {
            properties: {
                title,
            },
        };
        const response = await sheetsClient.spreadsheets.create({
            requestBody: {
                properties: {
                    title,
                },
            },
            fields: 'spreadsheetId',
        });
        const spreadsheetId = response.data.spreadsheetId;
        if (!spreadsheetId) {
            throw new Error('Failed to create Google Sheet - no ID returned');
        }
        console.log(`Google Sheet created successfully: ${spreadsheetId}`);
        return spreadsheetId;
    }
    catch (error) {
        console.error('Failed to create Google Sheet:', error);
        throw error;
    }
}
/**
 * Share a Google Sheet with a user via email
 */
export async function shareGoogleSheetWithUser(spreadsheetId, userEmail, userName = '') {
    if (!sheetsClient) {
        throw new Error('Google Sheets service not initialized');
    }
    try {
        const request = {
            spreadsheetId,
            requestBody: {
                role: 'reader', // read-only access
                type: 'user',
                emailAddress: userEmail,
            },
        };
        const drive = google.drive({
            version: 'v3',
            auth: authClient,
        });
        await drive.permissions.create(request);
        console.log(`Google Sheet ${spreadsheetId} shared with ${userEmail}`);
    }
    catch (error) {
        console.error('Failed to share Google Sheet:', error);
        throw error;
    }
}
/**
 * Get the Google Sheets client (for testing or direct access)
 */
export function getGoogleSheetsClient() {
    return sheetsClient;
}
/**
 * Populate the first row of a sheet with column headers
 */
export async function populateSheetHeaders(spreadsheetId, headers) {
    if (!sheetsClient) {
        throw new Error('Google Sheets service not initialized');
    }
    await sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: {
            values: [headers],
        },
    });
}
/**
 * Append a row of data to the sheet (after the last row)
 */
export async function appendSheetRow(spreadsheetId, rowData) {
    if (!sheetsClient) {
        throw new Error('Google Sheets service not initialized');
    }
    await sheetsClient.spreadsheets.values.append({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [rowData],
        },
    });
}
/**
 * Get the public URL for a Google Sheet
 */
export function getSheetUrl(spreadsheetId) {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
}
