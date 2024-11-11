## Install modules

```console
npm install
 ```

## Start Docker

Run in the 1st terminal

```console
docker-compose up --build 
```

Run in the 2nd terminal

```console
docker exec -it app sh -c "npx knex migrate:latest --knexfile=./models/knexfile.ts"
```

### Docker highly discourage usage of cron in the same container with the main app, so I've created a separate container for the cron job.

Till `tariffs` table is not populated, `crontab` job will be in idle mode.

#### `boxDeliveryAndStorageExpress` is the asc sorting field for the incoming data.

## HELPERS

```console
docker exec -it app sh -c "npx ts-node cli.ts"
```

Upload to `number` of sheets, sheets will be created if necessary

```console
docker exec -it app sh -c "npx ts-node cli.ts uploadToGoogleSheets --number 5"
```


### DOCS

```console
 npx jsdoc -c jsdoc.json
```
