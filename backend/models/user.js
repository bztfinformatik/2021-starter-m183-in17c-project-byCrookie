const db = require("../util/db");
const helper = require("../util/helper");

function usersToObj(result) {
  const users = result[0].map((user) => {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      avatar: user.avatar
    };
  });
  return users;
}

function objToUser(object) {
  return {
    firstname: object.firstname,
    lastname: object.lastname,
    username: object.username,
    avatar: object.avatar,
    pwd: object.pwd
  };
}

module.exports = class User {
  static async add(object) {
    const user = objToUser(object);
    if (!helper.isEmpty(User.getByUsername(user.username))) {
      var error = new Error("User already exists");
      throw error;
    }

    const sql =
      "insert into user" +
      "    ( firstname, lastname, username, pwd, avatar)" +
      "  values" +
      "    (?, ?, ?, ?, ?)";

    const values = [user.firstname, user.lastname, user.username, user.pwd, user.avatar];
    await db.set([{ sql: sql, values: values }]);
  }

  static async filter(query) {
    const condition = helper.queryToSqlCondition("user", query);

    const sql = `select * from user where ${condition.where}`;
    const result = await db.get({ sql: sql, values: condition.values });

    return usersToObj(result);
  }

  static async getByUsername(username) {
    const sql = "select * from user where username = ?";
    const result = await db.get({ sql: sql, values: [username] });
    return usersToObj(result);
  }

  static async getByCredentials(username, pwd) {
    const sql =
      "select *" + "    from user" + "    where" + "      username = ? and" + "      pwd = ?";

    const values = [username, pwd];

    const result = await db.get({ sql: sql, values: values });
    return usersToObj(result);
  }

  static async getByIds(ids) {
    let values = new Array(0);
    let sql = `select * from user`;

    if (ids) {
      const condition = helper.paramsToSqlCondition("user", ids);
      sql = `${sql} where ${condition.where}`;
      values = condition.values;
    }

    const result = await db.get({ sql: sql, values: values });
    return usersToObj(result);
  }

  static async deleteByIds(ids) {
    let rows = 0;

    if (!helper.isEmpty(ids)) {
      const condition = helper.paramsToSqlCondition("user", ids);
      const sql = `delete from user where ${condition.where}`;
      const values = condition.values;
      rows = await db.set([{ sql: sql, values: values }]);
    }

    return { usersDeleted: rows };
  }
};
