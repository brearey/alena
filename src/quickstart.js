import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// The scope for reading spreadsheets.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), './dist/credentials.json');


export async function listMajors() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });


  const sheets = google.sheets({version: 'v4', auth});

	// READ
  // const result = await sheets.spreadsheets.values.get({
  //   spreadsheetId: '1bOlj1aRIuFOWJNPQsiOTvBQBSbbISlPB6wmxE3J4vaI',
  //   range: 'A1:A3',
  // });
  // const rows = result.data.values;
  // if (!rows || rows.length === 0) {
  //   console.log('No data found.');
  //   return;
  // }
  // console.log('Name, Major:');

  // rows.forEach((row) => {
  //   console.log(row);
  // });

	// WRITE
  let values = [
    ['a'],['b'],['c'],
  ];

  const resource = {
    values,
  };

  // Update the values in the spreadsheet.
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: '1bOlj1aRIuFOWJNPQsiOTvBQBSbbISlPB6wmxE3J4vaI',
    range: 'A1:A3',
    valueInputOption: 'RAW',
    requestBody: resource,
  });
	console.log(result)
}

