const mysql = require("mysql2");
const logger = require("./log");

const connectionPool = mysql.createPool({
  host: process.env.NODE_DBHOST,
  user: process.env.NODE_DBUSER,
  database: process.env.NODE_DBSCHEMA,
  password: process.env.NODE_DBPWD
});

async function execute(sql, values, connection) {
  if (logger.levels[process.env.NODE_LOGLEVEL] >= logger.levels.verbose) {
    const formatedSql = await format(connection, sql, values);
    const result = await execute_sql(connection, formatedSql);
    logger.debug("Executed sql query", {
      sql: sql,
      values: values,
      formatedSql: formatedSql,
      result: result[0]
    });
    return result;
  } else {
    return await prepare_execute(connection, sql, values);
  }
}

async function prepare_execute(connection, sql, values) {
  try {
    return await connection.execute(sql, values);
  } catch (err) {
    logger.error("Error while executing prepared sql", {
      sql: sql,
      values: values,
      error: err.message
    });
    throw err;
  }
}

async function execute_sql(connection, formatedSql) {
  try {
    return await connection.execute(formatedSql);
  } catch (err) {
    logger.error("Error while executing sql", {
      query: formatedSql,
      error: err.message
    });
    throw err;
  }
}

async function format(connection, sql, values) {
  try {
    return connection.format(sql, values);
  } catch (err) {
    logger.error("Error while preparing sql", {
      sql: sql,
      values: values,
      error: err.message
    });
    throw err;
  }
}

async function get(stmt) {
  const connection = connectionPool.promise();
  try {
    await start_transaction(connection);
    const result = await execute(stmt.sql, stmt.values, connection);
    await commit_transaction(connection);
    return result;
  } catch (err) {
    await rollback_transaction(connection);
    throw err;
  }
}

async function set(stmts) {
  const connection = connectionPool.promise();
  try {
    await start_transaction(connection);
    let affectedRows = 0;
    for (const stmt of stmts) {
      const result = await execute(stmt.sql, stmt.values, connection);
      affectedRows = affectedRows + result[0].affectedRows;
    }
    await commit_transaction(connection);
    return affectedRows;
  } catch (err) {
    await rollback_transaction(connection);
    throw err;
  }
}

async function start_transaction(connection) {
  return connection.query(`start transaction`);
}

async function commit_transaction(connection) {
  return connection.query(`commit`);
}

async function rollback_transaction(connection) {
  return connection.query(`rollback`);
}

module.exports.get = get;
module.exports.set = set;
