// db.js
const mysql = require('mysql2');
require('dotenv').config();


// const pool = mysql.createPool({
//   host: 'briskmfg.cloud',
//   user: 'remoteappuser',
//   password: 'Pa\$\$w0rd',
//   database: 'briskmfgdb',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// const pool = mysql.createPool({
//   host: '165.22.239.202',
//   user: 'tamsil',
//   password: 'Tamsil@123123123123',
//   database: 'briskmfgdb',
//   waitForConnections: true,
//   connectionLimit: 100,
//   queueLimit: 0,
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

module.exports = pool.promise();