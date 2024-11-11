import { google } from "googleapis";
import { knex } from "../../../models/knexfile";
import { getStringDate } from "./../../utils";
import { DBWarehouse } from "@services/Widberries/types";

const { OAuth2Client } = require("google-auth-library");

import { OAuthCredentials } from "./OAuth";

const sheets = google.sheets("v4");
const getGoogleSheetIds = async () => {
    return [
        "18eC0IRhWEYJp4edsM7u4JS5b0huwjg1jkZZMQCHo0rs", 
        "1TFj2paIgGMxmcWL_vDc06iNTD6BQ8kjk9jJViOKD158", 
        "1ED45wJPPmeuxaIs_GNGJsHexIzY2sm85WJkqxdCC70k"
    ];
};
const sheetName = `stocks_coefs`;
const range = `${sheetName}!A1`;

/** GoogleSheets Service Class */

export class GoogleSheetsService {
    /**
     * Get the authorization client for Google Sheets API
     *
     * @returns {Promise<OAuth2Client>}
     */
    static async authorize(): Promise<typeof OAuth2Client> {
        const auth = new google.auth.GoogleAuth({
            credentials: OAuthCredentials,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        return (await auth.getClient()) as typeof OAuth2Client;
    }

    static exportDataToSheets = async (date?: Date, number: number = 3) => {
        const tariffs = date
            ? await knex("tariffs").orderBy("box_delivery_and_storage_expr", "asc").where("date", getStringDate(date))
            : await knex("tariffs").orderBy("box_delivery_and_storage_expr", "asc");

        let sheetIds = await getGoogleSheetIds();

        if (sheetIds.length < number) {
            console.log(`Got ${sheetIds.length}, need ${number - sheetIds.length} new sheets`);
            const needed = [];
            for (let i = 0; i < number - sheetIds.length; i++) {
                needed.push(await GoogleSheetsService.createGoogleSheet());
            }
            sheetIds = [...sheetIds, ...needed];
        }

        console.log(sheetIds.length + " tables in total");

        for (const sheetId of sheetIds) {
            const sheetExists = await GoogleSheetsService.checkSheetExists(sheetId, sheetName);
            if (!sheetExists) {
                await GoogleSheetsService.createNewSheet(sheetId, sheetName);
            }
            await GoogleSheetsService.exportToGoogleSheets(sheetId, sheetName, tariffs);
        }
    };

    static createGoogleSheet = async (): Promise<string> => {
        const authClient = await GoogleSheetsService.authorize();
        const response = await sheets.spreadsheets.create({
            auth: authClient,
            requestBody: {
                properties: {
                    title: "New Google Sheet",
                },
                sheets: [
                    {
                        properties: {
                            title: sheetName,
                        },
                    },
                ],
            },
        });
        const spreadsheetId = response.data.spreadsheetId;

        if (!spreadsheetId) {
            throw new Error("Error while creating spreadsheet");
        }

        console.log(`Created new Google Sheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

        return spreadsheetId;
    };

    static createNewSheet = async (sheetId: string, sheetName: string) => {
        const authClient = await GoogleSheetsService.authorize();

        const request = {
            spreadsheetId: sheetId,
            resource: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetName,
                            },
                        },
                    },
                ],
            },
            auth: authClient,
        };
        try {
            const response = await sheets.spreadsheets.batchUpdate(request);
            const spreadsheetId = response.data.spreadsheetId;

            console.log(`Sheet "${sheetName}" was created successfully.`);
            console.log(`Link to table: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

            return spreadsheetId;
        } catch (error) {
            console.error("Error creating sheet:", error);
            throw error;
        }
    };

    static exportToGoogleSheets = async (sheetId: string, sheetName: string, data: DBWarehouse[]) => {
        const authClient = await GoogleSheetsService.authorize();

        const request = {
            spreadsheetId: sheetId,
            range: range,
            valueInputOption: "RAW",
            resource: {
                values: data.map((row) => [
                    row.warehouse_name,
                    row.box_delivery_and_storage_expr,
                    row.box_delivery_base,
                    row.box_delivery_liter,
                    row.box_storage_base,
                    row.box_storage_liter,
                ]),
            },
            auth: authClient,
        };

        try {
            const response = await sheets.spreadsheets.values.update(request);
            const spreadsheetId = response.data.spreadsheetId;

            console.log(`Successfully uploaded to Google Sheets: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
        } catch (error) {
            console.error("Error uploading to Google Sheets: ", error);
        }
    };

    static checkSheetExists = async (sheetId: string, sheetName: string) => {
        const authClient = await GoogleSheetsService.authorize();

        try {
            const response = await sheets.spreadsheets.get({
                spreadsheetId: sheetId,
                auth: authClient,
            });

            const sheet = response.data.sheets?.find((sheet) => sheet.properties?.title === sheetName);
            return !!sheet;
        } catch (error) {
            console.error("Error when checking sheet:", error);
            return false;
        }
    };

    static fetchSheet = async (sheetId: string) => {
        const authClient = await GoogleSheetsService.authorize();

        try {
            return await sheets.spreadsheets.get({
                spreadsheetId: sheetId,
                auth: authClient,
            });
        } catch (error) {
            console.error("Error while retrieving list of sheets:", error);
            return false;
        }
    };

    /**
     * Clear the data in the specified range of the specified sheet
     *
     * @returns {Promise<void>}
     */
    static async clearGoogleSheet(): Promise<void> {
        const authClient = await this.authorize();

        const sheetIds = await getGoogleSheetIds();

        console.log(sheetIds.length + " tables in total");

        for (const sheetId of sheetIds) {
            const sheetName = `stocks_coefs`;

            const request = {
                sheetId,
                range: range,
                resource: {},
                auth: authClient,
            };

            try {
                const response = (await sheets.spreadsheets.values.clear(request)).data;
            } catch (err) {
                console.error(err);
            }
        }

        console.log("GoogleSheet deleted");
    }
}
