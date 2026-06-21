import { sheets_v4 } from 'googleapis';
/**
 * Initialize Google Sheets service with service account credentials
 */
export declare function initializeGoogleSheetsService(): Promise<void>;
/**
 * Create a new Google Sheet with a title
 */
export declare function createGoogleSheet(title: string): Promise<string>;
/**
 * Share a Google Sheet with a user via email
 */
export declare function shareGoogleSheetWithUser(spreadsheetId: string, userEmail: string, userName?: string): Promise<void>;
/**
 * Get the Google Sheets client (for testing or direct access)
 */
export declare function getGoogleSheetsClient(): sheets_v4.Sheets | null;
/**
 * Populate the first row of a sheet with column headers
 */
export declare function populateSheetHeaders(spreadsheetId: string, headers: string[]): Promise<void>;
/**
 * Append a row of data to the sheet (after the last row)
 */
export declare function appendSheetRow(spreadsheetId: string, rowData: (string | null)[]): Promise<void>;
/**
 * Get the public URL for a Google Sheet
 */
export declare function getSheetUrl(spreadsheetId: string): string;
