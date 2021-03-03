const db = require("../util/db");
const helper = require("../util/helper");

function postingsToObj(result) {
  const postings = result[0].map((posting) => {
    return {
      id: posting.id,
      author_id: posting.author_id,
      parent_id: posting.parent_id,
      title: posting.title,
      content: posting.content,
      timestamp: posting.timestamp
    };
  });
  return postings;
}

module.exports = class Posting {
  static async filter(query) {
    const condition = helper.queryToSqlCondition("posting", query);

    console.log(condition);

    const sql = `select * from posting where ${condition.where}`;
    const result = await db.get({ sql: sql, values: condition.values });

    return postingsToObj(result);
  }

  static async getByIds(ids) {
    let values = new Array(0);
    let sql = `select * from posting`;

    if (ids) {
      const condition = helper.paramsToSqlCondition("posting", ids);
      sql = `${sql} where ${condition.where}`;
      values = condition.values;
    }

    const result = await db.get({ sql: sql, values: values });
    return postingsToObj(result);
  }

  static async deleteByIds(ids) {
    let rows = 0;

    if (!helper.isEmpty(ids)) {
      const condition = helper.paramsToSqlCondition("posting", ids);
      const sql = `delete from posting where ${condition.where}`;
      const values = condition.values;
      rows = await db.set([{ sql: sql, values: values }]);
    }

    return { postingsDeleted: rows };
  }
};
