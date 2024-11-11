import { Knex } from "knex";

// In SQL, table naming conventions play a crucial role in maintaining a clear, consistent, 
// and understandable database structure. Here are some widely followed conventions:
// Use Snake : common conventions include using snake_case (e.g., customer_orders)
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.string("warehouse_name").notNullable();
        table.date("date").notNullable();
        table.string("box_delivery_and_storage_expr").notNullable();
        table.string("box_delivery_base").notNullable();
        table.string("box_delivery_liter").notNullable();
        table.string("box_storage_base").notNullable();
        table.string("box_storage_liter").notNullable();
        table.unique(["warehouse_name", "date"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("tariffs");
}
