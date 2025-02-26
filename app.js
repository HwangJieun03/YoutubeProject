const express = require("express");
const app = express();

app.listen(1111);

// user-demo.js 호출
const userRouter = require("./routes/users");
// channel-demo.js 호출
const channelRouter = require("./routes/channels");

// 라우터 통합
app.use("/", userRouter);
app.use("/channels", channelRouter); //공통된 URL 빼내기
