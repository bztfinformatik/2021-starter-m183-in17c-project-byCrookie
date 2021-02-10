module.exports = {
  // object "obj" is empty or null return true, return false in all other cases
  isEmpty(obj) {
    let isEmpty = false;

    if (!obj || (Object.keys(obj).length === 0 && obj.constructor === Object)) {
      isEmpty = true;
    }

    return isEmpty;
  },

  // converts an express query-string-object to a sql where-clause (sql search-condition)
  // where-clause and corresponding values are separated (for future use as prepared statement)
  queryToSqlCondition(table, query) {
    let attrs = new Array(0);
    let values = new Array(0);

    for (const key in query) {
      attrs.push(`(cast(${table}.${key} as char(256)) = ?)`);
      values.push(`${query[key]}`);
    }
    return {
      where: `${attrs.join(" and ")}`,
      values: values,
    };
  },

  // values in route parameter is a list of comma separated ids (list can have one id only)
  // converts list of ids (params) to a corresponding sql where-clause (sql search-condition)
  // (assuming that the name of identifying primary key is alsways "id")

  paramsToSqlCondition(table, params) {

    let values = new Array(0);

    values = params.split(",");
    let ids = new Array(values.length);
    ids = ids.fill(`(cast(${table}.id as char(256)) = ?)`);

    return {
      where: `${ids.join(" or ")}`,
      values: values
    };

  }
};
