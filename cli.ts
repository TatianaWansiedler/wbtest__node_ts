import { Command } from "commander";
import { WildberriesDBService } from "./src/services/Widberries/WildberriesDBService";
import { GoogleSheetsService } from "./src/services/GoogleSheets/GoogleSheetsService";
import { WildberriesService } from "./src/services/Widberries/WildberriesService"; // Import functions for commands

const program = new Command();

program
    .command("clearDB")
    .description("delete all data from the database")
    .action(async () => {
        console.log("Deleting...");
        await WildberriesDBService.deleteAllWarehouse();
    });

program
    .command("syncDBAndGoogleSheets")
    .description("sync the DB and Google Sheets")
    .action(async () => {
        console.log("Syncing...");
        await WildberriesService.syncWarehousesWithDBAndGoogleSheets();
    });

program
    .command("uploadToGoogleSheets")
    .description("upload to Google Sheets")
    .option("-n, --number <number>", "how many sheets upload to", "3")
    .action(async (options) => {
        const numberOfSheets = parseInt(options.number, 10);
        // Validate that the argument is a number
        if (isNaN(numberOfSheets) || numberOfSheets <= 0) {
            console.error("Please provide a valid number of sheets to upload (greater than 0).");
            return;
        }
        console.log(`Uploading to ... ${options.number} sheets`);
        await GoogleSheetsService.exportDataToSheets(new Date(), Number(options.number));
    });

program.parse(process.argv);
