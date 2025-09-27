import { google } from 'googleapis'
import env from '#config/env/env.js'

const auth = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
)

auth.apiKey = env.GOOGLE_API_KEY

export const sheets = google.sheets({ version: 'v4', auth })