const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const conn = require("../mariadb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

// 로그인
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("이메일 형식을 맞춰주세요."),
    body("pwd").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    validate,
  ],
  (req, res) => {
    const { email, pwd } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";
    conn.query(sql, email, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }

      var loginUser = results[0];

      if (loginUser && loginUser.pwd === pwd) {
        //토큰 발행
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "30m", // 30분
            issuer: "jieun", // 발행자
          }
        );

        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({
          message: `${loginUser.name}님 환영합니다. 메인 페이지로 이동합니다.`,
          token: token,
        });
      } else {
        res
          .status(404)
          .json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
      }
    });
  }
);

// 회원가입
router.post(
  "/join",
  [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("이메일 형식을 맞춰주세요."),
    body("name").notEmpty().isString().withMessage("이름 확인 필요"),
    body("pwd").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    body("phone").notEmpty().isString().withMessage("연락처 확인 필요"),
    validate,
  ],
  (req, res) => {
    const { email, name, pwd, phone } = req.body;
    let sql = `INSERT INTO users (email, name, pwd, phone) VALUES (?,?,?,?)`;
    let values = [email, name, pwd, phone];
    conn.query(sql, values, function (err, results) {
      if (err) {
        console.log(err);
        return res.status(400).end();
      }
      res.status(201).json(results);
    });
  }
);

// 회원 개별 조회
router
  .route("/users")
  .get(
    [
      body("email")
        .notEmpty()
        .isString()
        .isEmail()
        .withMessage("이메일 형식을 맞춰주세요."),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;

      let sql = "SELECT * FROM users WHERE email = ?";
      conn.query(sql, email, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        res.status(200).json(results);
      });
    }
  )

  // 회원 개별 삭제
  .delete(
    [
      body("email")
        .notEmpty()
        .isString()
        .isEmail()
        .withMessage("이메일 형식을 맞춰주세요."),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;

      let sql = `DELETE FROM users WHERE email =?`;
      conn.query(sql, email, function (err, results) {
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

module.exports = router;
