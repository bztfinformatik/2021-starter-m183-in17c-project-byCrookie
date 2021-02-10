const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  host: process.env.NODE_DBHOST,
  user: process.env.NODE_DBUSER,
  database: process.env.NODE_DBSCHEMA,
  password: process.env.NODE_DBPWD,
});

async function execute(sql, values, connection) {
    const formatedSql = connection.format(sql, values);
    const result = await connection.execute(formatedSql);
    return result;
}


async function get(stmt) {
  const connection = connectionPool.promise();
  let result = new Array(0);

  try {
    await connection.query(`start transaction`);
    result = await execute(stmt.sql, stmt.values, connection);
    await connection.query(`commit`);
    return result;
  } catch (err) {
    await connection.query(`rollback`);
    throw err;
  }
}

async function set(stmts) {
  const connection = connectionPool.promise();
  let affectedRows = 0;

  try {
    await connection.query(`start transaction`);
    for (const stmt of stmts) {
      const result = await execute(stmt.sql, stmt.values, connection);
      affectedRows = affectedRows + result[0].affectedRows;
    }
    await connection.query(`commit`);
    return affectedRows;
  } catch (err) {
    await connection.query(`rollback`);
    throw err;
  }
}

module.exports.get = get;
module.exports.set = set;
