const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next(); // 다음 할 일 (미들웨어)
  } else {
    return res.status(400).json(err.array());
  }
};

router
  // 채널 생성
  .route("/")
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("숫자로 입력해주세요"),
      body("channelTitle")
        .notEmpty()
        .isString()
        .withMessage("문자로 입력해주세요."),
      validate,
    ],
    (req, res) => {
      const { channelTitle, userId } = req.body;

      let sql = `INSERT INTO channels (channelTitle, user_id) VALUES (?,?)`;
      let values = [channelTitle, userId];
      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        res.status(201).json(results);
      });
    }
  )

  // 채널 전체 조회
  .get(
    [
      body("userId").notEmpty().isInt().withMessage("숫자로 입력해주세요"),
      validate,
    ],
    (req, res) => {
      var { userId } = req.body;

      let sql = "SELECT * FROM channels WHERE user_id = ?";
      conn.query(sql, userId, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) res.status(200).json(results);
        else cannotFindChannel(res);
      });
    }
  );

router
  .route("/:id")
  // 채널 개별 조회
  .get(
    [param("id").notEmpty().withMessage("채널 id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      let sql = "SELECT * FROM channels WHERE id = ?";
      conn.query(sql, id, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) res.status(200).json(results);
        else cannotFindChannel(res);
      });
    }
  )

  // 채널 개별 수정
  .put(
    [
      param("id").notEmpty().withMessage("채널 id 필요"),
      body("channelTitle").notEmpty().isString().withMessage("채널명 오류"),
      validate,
    ],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);
      let { channelTitle } = req.body;

      let sql = "UPDATE channels SET channelTitle=? WHERE id = ?";
      let values = [channelTitle, id];
      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  )

  // 채널 개별 삭제
  .delete(
    [param("id").notEmpty().withMessage("채널 id 필요"), validate],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      let sql = "DELETE FROM channels WHERE id = ?";
      conn.query(sql, id, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  );

function cannotFindChannel(res) {
  res.status(404).json({
    message: "채널 정보를 조회할 수 없습니다.",
  });
}

module.exports = router;
