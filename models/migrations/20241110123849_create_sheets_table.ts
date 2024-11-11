import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("sheets", (table) => {
        table.increments("id").primary();
        table.string("sheet_id").notNullable();
        table.string("description");
        table.unique(["sheet_id"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("sheets");
}
