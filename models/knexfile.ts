import knexClient, { Knex as KnexType } from "knex";

require("dotenv").config();

export const pgSQLConfig: KnexType.Config = {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: "./migrations",
    },
    seeds: {
        directory: "./seeds",
    },
};

export const knex = knexClient(pgSQLConfig);
export default pgSQLConfig;
