const express = require("express");
const router = express.Router();

const conn = require("../mariadb");

router.use(express.json());

router.post("/login", (req, res) => {
  const { email, pwd } = req.body;
  var loginUser = {};

  let sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, function (err, results) {
    if (results.length) {
      loginUser = results[0];

      if (loginUser.pwd === pwd) {
        res.status(201).json({
          message: `${loginUser.name}님 환영합니다. 메인 페이지로 이동합니다.`,
        });
      }
    } else {
      res
        .status(404)
        .json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }
  });
});

router.post("/join", (req, res) => {
  if (req.body == {}) {
    res.status(400).json({
      message: "입력값을 다시 확인해주세요.",
    });
  } else {
    const { email, name, pwd, phone } = req.body;
    let sql = `INSERT INTO users (email, name, pwd, phone) VALUES (?,?,?,?)`;
    let values = [email, name, pwd, phone];
    conn.query(sql, values, function (err, results) {
      res.status(201).json(results);
    });
  }
});

router
  .route("/users")
  .get((req, res) => {
    let { email } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";
    conn.query(sql, email, function (err, results) {
      if (results.length) res.status(200).json(results);
      else {
        res.status(404).json({
          message: "존재하지 않는 회원입니다.",
        });
      }
    });
  })

  .delete((req, res) => {
    let { email } = req.body;

    let sql = `DELETE FROM users WHERE email =?`;
    conn.query(sql, email, function (err, results) {
      res.status(200).json(results);
    });
  });

module.exports = router;
