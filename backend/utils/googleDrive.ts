import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_IMAGE,
    process.env.GOOGLE_CLIENT_SECRET_IMAGE,
    process.env.GOOGLE_REDIRECT_URI_IMAGE
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN_IMAGE
});

export const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});