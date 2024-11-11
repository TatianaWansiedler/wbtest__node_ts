/** 
 * Represents a warehouse in the database.
 * @typedef {Object} DBWarehouse
 * @property {number} id - The unique identifier of the warehouse in the database.
 * @property {string} warehouse_name - The name of the warehouse.
 * @property {string} box_delivery_and_storage_expr - The expression cost for box delivery and storage.
 * @property {string} box_delivery_base - The base cost for box delivery.
 * @property {string} box_delivery_liter - The cost for box delivery per liter.
 * @property {string} box_storage_base - The base cost for box storage.
 * @property {string} box_storage_liter - The cost for box storage per liter.
 * @property {Date} date - The date associated with this entry.
 */
export type DBWarehouse = {
    id: number;
    warehouse_name: string;
    box_delivery_and_storage_expr: string;
    box_delivery_base: string;
    box_delivery_liter: string;
    box_storage_base: string;
    box_storage_liter: string;
    date: Date;
};

/** 
 * Represents a warehouse.
 * @typedef {Object} Warehouse
 * @property {string} boxDeliveryAndStorageExpr - The expression cost for box delivery and storage.
 * @property {string} boxDeliveryBase - The base cost for box delivery.
 * @property {string} boxDeliveryLiter - The cost for box delivery per liter.
 * @property {string} boxStorageBase - The base cost for box storage.
 * @property {string} boxStorageLiter - The cost for box storage per liter.
 * @property {string} warehouseName - The name of the warehouse.
 */
export type Warehouse = {
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    warehouseName: string;
};
