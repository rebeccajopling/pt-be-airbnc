# AirBNC

### 1. Create the Database

Create the local database by running this command:

`psql -f create_db.sql`

### 2. Set Up Environment Variables

Create a .env file and add the following:

`PGDATABASE=airbnc_test`

### 3. Connect the Database

Create a connection.js file to manage the connection:

```js
const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool();
module.exports = pool;
```
