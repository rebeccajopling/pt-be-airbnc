<p align="center">
  <img src="./assets/airbnc_banner_be.png" alt="airbnc banner" width="1000"/>
</p>

<br>
AirBnC is the back-end API of a full stack property booking application, connected to a custom React front end interface: [<link>](https://github.com/rebeccajopling/pt-fe-airbnc)

It is built with Node.js, Express, and PostgreSQL, and supports features like property listings, property reviews and user accounts. The database is hosted on Supabase and deployed on Render.
<br>

#### Live Site

---

🔗 [<link>](https://airbnc-ez73.onrender.com/)
<br>

### 1. Create the Database

Create the local databases (test and dev) by running this command:

`npm run setup-dbs`

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
