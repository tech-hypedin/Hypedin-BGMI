import { google } from 'googleapis';

let sheets: any;
let initialized = false;

export const initializeSheets = () => {
    if (initialized) return;

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !rawPrivateKey) {
        throw new Error('[GOOGLE SHEETS] Core environment variables are missing.');
    }

    try {
        if (rawPrivateKey.startsWith('"') && rawPrivateKey.endsWith('"')) {
            rawPrivateKey = rawPrivateKey.slice(1, -1);
        }

        const formattedPrivateKey = rawPrivateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail.trim(),
                private_key: formattedPrivateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        sheets = google.sheets({ version: 'v4', auth });
        initialized = true;

        console.log('[GOOGLE SHEETS] Initialized successfully');
    } catch (error) {
        console.error('[GOOGLE SHEETS] Failed to initialize GoogleAuth client:', error);
        throw error;
    }
}

export const appendToGoogleSheets = async (spreadsheetId: string, range: string, values: any[][]) => {
    try {
        if (!initialized) {
            initializeSheets();
        }

        if (!spreadsheetId) {
            throw new Error('[GOOGLE SHEETS] spreadsheetId is required');
        }

        if (!values || values.length === 0) {
            throw new Error('[GOOGLE SHEETS] values array cannot be empty');
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        return response.data;
    } catch (err: any) {
        console.error('[GOOGLE SHEETS] ❌ Error appending data:', err.message);
        throw err;
    }
}

export const appendToGoogleSheetsForContactForm = async (spreadsheetId: string, range: string, values: any[][]) => {
    try {
        if (!initialized) {
            initializeSheets();
        }

        if (!spreadsheetId) {
            throw new Error('[GOOGLE SHEETS] spreadsheetId is required');
        }

        if (!values || values.length === 0) {
            throw new Error('[GOOGLE SHEETS] values array cannot be empty')
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values,
            }
        });

        return response.data;
    } catch(err: any) {
        console.log('[GOOGLE SHEETS] ❌ Error appending data:', err.message);
    }
}

export const appendPlayerToGoogleSheets = async (spreadsheetId: string, range: string, values: any[][]) => {
    try {
        if (!initialized) {
            initializeSheets();
        }

        if (!spreadsheetId) {
            throw new Error('[GOOGLE SHEETS] spreadsheetId is required');
        }

        if (!values || values.length === 0) {
            throw new Error('[GOOGLE SHEETS] values array cannot be empty');
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values
            }
        });

        return response.data;
    } catch(error: any) {
        console.log('[GOOGLE SHEETS] ❌ Error appending data:', error.message);
    }
}

export const checkGoogleSheetsConnection = async (spreadsheetId: string) => {
    try {
        if (!initialized) {
            initializeSheets();
        }

        await sheets.spreadsheets.get({ spreadsheetId });
        console.log('[GOOGLE SHEETS] ✅ Connection verified');
        return true;
    } catch (error: any) {
        console.error('[GOOGLE SHEETS] ❌ Connection failed:', error.message);
        return false;
    }
}