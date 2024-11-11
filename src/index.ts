import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { WildberriesDBService } from "./services/Widberries/WildberriesDBService";

dotenv.config();

export const app = express();

const { PORT } = process.env;

/**
 * Root endpoint to see saved Warehouses
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
app.get("/", async (req: Request, res: Response): Promise<void> => {
    res.json(await WildberriesDBService.getWarehouses());
});

app.get("/datadownload", async (req: Request, res: Response): Promise<void> => {
    res.json("done");
});

/** Start the server */
app.listen(PORT, () => {
    console.info(`[server]: Server is running at http://0.0.0.0:${PORT}`);
});
