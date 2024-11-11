import cron from "node-cron";
import { WildberriesService } from "@services/Widberries/WildberriesService";
import { knex } from "../models/knexfile";

const tableExists = async (tableName: string) => {
    return await knex.schema.hasTable(tableName);
};

console.log("Cron job started");
console.log("===========================================");

const job = cron.schedule("0 0 * * * *", async function jobYouNeedToExecute() {
    console.log("Running task every hour:", new Date().toISOString());
    console.log("===========================================");

    if (await tableExists("tariffs")) {
        WildberriesService.syncWarehousesWithDBAndGoogleSheets()
            .then(() => {
                console.log("Warehouses synced successfully");
                console.log("===========================================");
            })
            .catch((error) => console.error("Error syncing warehouses:", error));
    } else {
        console.log("Tariffs table doesn't exists");
    }
});
job.start();

// Keep the process alive
setInterval(() => {}, 1000);
