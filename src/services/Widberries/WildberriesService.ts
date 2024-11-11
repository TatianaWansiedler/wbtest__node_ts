import axios from "axios";
import { WildberriesDBService } from "./WildberriesDBService";
import { GoogleSheetsService } from "../GoogleSheets/GoogleSheetsService";
import { Warehouse } from "./types";
import { getStringDate } from "./../../utils";

export type ResponseData = {
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: Warehouse[];
};

/** Wildberries API interactions service class */
export class WildberriesService {
    /**
     * Fetch API Wildberries warehouses
     *
     * @async
     * @param {Date} date - The date for which to fetch the warehouses
     * @param sort - Sort the warehouses by coefficient
     * @returns {Promise<Warehouse[]>} - The list of warehouses with coefficients
     */
    static async fetchWarehouses(date: Date, sort: boolean = true): Promise<Warehouse[]> {
        const url = `https://common-api.wildberries.ru/api/v1/tariffs/box`;

        try {
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${process.env.SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                params: {
                    date: getStringDate(date),
                },
            });

            const {
                response: {
                    data: { warehouseList },
                },
            } = response.data as {
                response: {
                    data: ResponseData;
                };
            };

            return sort
                ? warehouseList.sort((a: Warehouse, b: Warehouse) => {
                      return parseFloat(a.boxDeliveryAndStorageExpr) - parseFloat(b.boxDeliveryAndStorageExpr);
                  })
                : warehouseList;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clear the database and Google Sheets
     *
     * @async
     * @returns {Promise<void>}
     */
    static async clearDBAndGoogleSheets(): Promise<void> {
        console.log("===========================================");
        await WildberriesDBService.deleteAllWarehouse();
        await GoogleSheetsService.clearGoogleSheet();
        console.log("===========================================");
    }

    /**
     * Sync warehouses with the database and Google Sheets
     *
     * @async
     * @returns {Promise<void>}
     */
    static async syncWarehousesWithDBAndGoogleSheets(date: Date = new Date()): Promise<void> {
        const warehouses = await WildberriesService.fetchWarehouses(date);
        await WildberriesDBService.saveWarehouses(warehouses, date);
        await GoogleSheetsService.exportDataToSheets();

        console.log("===========================================");
    }
}
