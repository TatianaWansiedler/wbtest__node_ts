import { Warehouse } from "./types";
import { knex } from "../../../models/knexfile";

/** DB Service Class */
export class WildberriesDBService {
    /**
     * Save multiple warehouses
     *
     * @async
     * @param {Warehouse[]} tariffsData - The data of the warehouses to save
     * @param {Date} date - The date associated with the warehouses
     * @returns {Promise<void>}
     */
    static async saveWarehouses(tariffsData: Warehouse[], date: Date): Promise<void> {
        for (const warehouse of tariffsData) {
            await knex("tariffs")
                .insert({
                    warehouse_name: warehouse.warehouseName,
                    box_delivery_and_storage_expr: warehouse.boxDeliveryAndStorageExpr,
                    box_delivery_base: warehouse.boxDeliveryBase,
                    box_delivery_liter: warehouse.boxDeliveryLiter,
                    box_storage_base: warehouse.boxStorageBase,
                    box_storage_liter: warehouse.boxStorageLiter,
                    date,
                })
                .onConflict(["warehouse_name", "date"])
                .merge();
        }

        console.info("DB Warehouses saved");
    }

    /**
     * Get all warehouses
     *
     * @async
     * @returns {Promise<Warehouse[]>} - The list of all warehouses
     */
    static async getWarehouses(): Promise<Warehouse[]> {
        return knex("tariffs").select("*");
    }

    /**
     * Find a warehouse by its ID
     *
     * @async
     * @param {number} id - The ID of the warehouse
     * @returns {Promise<Warehouse>} - The warehouse data
     */
    static async findSWarehouseById(id: number): Promise<Warehouse> {
        return knex("tariffs").where({ id }).first();
    }

    /**
     * Update a warehouse by its ID
     *
     * @async
     * @param {number} id - The ID of the warehouse
     * @param {Warehouse} data - The new data for the warehouse
     * @returns {Promise<number>} - The number of rows affected
     */
    static async updateWarehouse(id: number, data: Warehouse): Promise<number> {
        return knex("tariffs").where({ id }).update(data);
    }

    /**
     * Delete a warehouse by its ID
     *
     * @async
     * @param {number} id - The ID of the warehouse
     * @returns {Promise<void>}
     */
    static async deleteWarehouse(id: number): Promise<void> {
        await knex("tariffs").where({ id }).del();
        console.warn("DB all warehouse deleted");
    }

    /**
     * Delete all warehouses
     *
     * @async
     * @returns {Promise<void>}
     */
    static async deleteAllWarehouse(): Promise<void> {
        try {
            await knex("tariffs").delete();
        } catch (error) {
            throw error;
        }
        console.warn("DB data deleted");
    }
}
