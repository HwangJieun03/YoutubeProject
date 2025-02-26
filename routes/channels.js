// express 모듈 셋팅
const express = require("express");
const router = express.Router();

const conn = require("../mariadb");

router.use(express.json()); // http 외 모듈인 '미들웨어' : json 설정
let db = new Map();
var id = 1;

router
  // 채널 생성
  .route("/")
  .post((req, res) => {
    const { channelTitle, userId } = req.body;
    if (channelTitle && userId && !isNaN(userId)) {
      let sql = `INSERT INTO channels (channelTitle, user_id) VALUES (?,?)`;
      let values = [channelTitle, userId];
      conn.query(sql, values, function (err, results) {
        res.status(201).json(results);
      });
    } else {
      res.status(400).json({
        message: "요청값이 잘못되었습니다.",
      });
    }
  })

  // 채널 전체 조회
  .get((req, res) => {
    var { userId } = req.body;

    let sql = "SELECT * FROM channels WHERE user_id = ?";
    userId // 단축 평가
      ? conn.query(sql, userId, function (err, results) {
          if (results.length) res.status(200).json(results);
          else cannotFindChannel(res);
        })
      : res.status(400).json({ message: "userId 값이 필요합니다." });

    // res.status(400).end();  실존하는 id값을 입력해도 오류
  });

router
  .route("/:id")
  // 채널 개별 조회
  .get((req, res) => {
    //const { id } = req.params;  500 에러 발생
    let { id } = req.params;
    id = parseInt(id);

    let sql = "SELECT * FROM channels WHERE id = ?";
    conn.query(sql, id, function (err, results) {
      if (results.length) res.status(200).json(results);
      else cannotFindChannel(res);
    });
  })

  // 채널 개별 수정
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);
    var oldTitle = channel.channelTitle;

    if (channel) {
      var newTitle = req.body.channelTitle;

      channel.channelTitle = newTitle;
      db.set(id, channel);

      res.status(200).json({
        message: `채널명이 ${oldTitle}에서 ${newTitle}(으)로 변경되었습니다. `,
      });
    } else {
      cannotFindChannel();
    }
  })

  // 채널 개별 삭제
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var channel = db.get(id);

    if (channel) {
      db.delete(id);
      res.status(200).json({
        message: `${channel.channelTitle}님, 채널이 정상적으로 삭제되었습니다. `,
      });
    } else {
      cannotFindChannel();
    }
  });

function cannotFindChannel(res) {
  res.status(404).json({
    message: "채널 정보를 조회할 수 없습니다.",
  });
}

module.exports = router;
