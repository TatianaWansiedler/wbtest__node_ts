import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("tariffs").del();

    await knex("tariffs").insert([
        {
            warehouse_name: "Warehouse A",
            box_delivery_and_storage_expr: "Formula A",
            box_delivery_base: "10",
            box_delivery_liter: "15",
            box_storage_base: "5",
            box_storage_liter: "7",
            date: new Date("2024-11-01"),
        },
        {
            warehouse_name: "Warehouse B",
            box_delivery_and_storage_expr: "Formula B",
            box_delivery_base: "12",
            box_delivery_liter: "18",
            box_storage_base: "6",
            box_storage_liter: "8",
            date: new Date("2024-12-01"),
        },
        // Add more entries as needed
    ]);
}
