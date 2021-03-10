const db = require("../util/db");
const helper = require("../util/helper");

function votesToObj(result) {
  const votes = result[0].map((vote) => {
    return {
      posting_id: vote.posting_id,
      votes: vote.isupvote
    };
  });
  return votes;
}

module.exports = class Vote {
  static getUpvoteCountByPostingSql() {
    return `select count(*) from vote where posting.id = vote.posting_id and isupvote = 1`;
  }

  static getDownvoteCountByPostingSql() {
    return `select count(*) from vote where posting.id = vote.posting_id and isupvote = 0`;
  }

  static async deleteByPostingIds(ids) {
    let rows = 0;

    if (!helper.isEmpty(ids)) {
      const condition = helper.paramsToSqlJoinCondition("posting", ids);
      const sql = `delete from vote where ${condition.where}`;
      const values = condition.values;
      rows = await db.set([{ sql: sql, values: values }]);
    }

    return { votesDeleted: rows };
  }
};
