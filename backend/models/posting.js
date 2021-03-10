const db = require("../util/db");
const helper = require("../util/helper");
const vote = require("./vote");
const logger = require("../util/log");

function postingsToObj(result) {
  const postings = result[0].map((posting) => {
    return {
      id: posting.id,
      author_id: posting.author_id,
      parent_id: posting.parent_id,
      title: posting.title,
      content: posting.content,
      timestamp: posting.timestamp,
      upvotes: posting.upvotes,
      downvotes: posting.downvotes
    };
  });
  return postings;
}

function objToPosting(object) {
  return {
    author_id: object.author_id,
    parent_id: object.parent_id,
    title: object.title,
    content: object.content,
    timestamp: object.timestamp
  };
}

module.exports = class Posting {
  static async add(object) {
    const posting = objToPosting(object);

    const sql =
      "insert into posting" +
      "    ( author_id, parent_id, title, content, timestamp)" +
      "  values" +
      "    (?, ?, ?, ?, ?)";

    const values = [
      posting.author_id,
      posting.parent_id,
      posting.title,
      posting.content,
      posting.timestamp
    ];

    await db.set([{ sql: sql, values: values }]);
  }

  static async filter(query) {
    const condition = helper.queryToSqlCondition("posting", query);

    console.log(condition);

    const sql = `select *, (${vote.getUpvoteCountByPostingSql()}) as upvotes, (${vote.getDownvoteCountByPostingSql()}) as downvotes from posting where ${
      condition.where
    }`;
    const result = await db.get({ sql: sql, values: condition.values });

    return postingsToObj(result);
  }

  static async getByIds(ids) {
    let values = new Array(0);
    let sql = `select *, (${vote.getUpvoteCountByPostingSql()}) as upvotes, (${vote.getDownvoteCountByPostingSql()}) as downvotes from posting`;

    if (ids) {
      const condition = helper.paramsToSqlCondition("posting", ids);
      sql = `${sql} where ${condition.where}`;
      values = condition.values;
    }

    const result = await db.get({ sql: sql, values: values });

    return postingsToObj(result);
  }

  static async deleteByIds(ids) {
    let posting_rows = 0;
    let vote_rows = 0;

    if (!helper.isEmpty(ids)) {
      const condition = helper.paramsToSqlCondition("posting", ids);
      const sql = `delete from posting where ${condition.where}`;
      const values = condition.values;

      vote_rows = await vote.deleteByPostingIds(ids);
      posting_rows = await db.set([{ sql: sql, values: values }]);
    }

    return { postingsDeleted: posting_rows, votesDeleted: vote_rows };
  }
};
