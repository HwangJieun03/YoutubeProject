## 0226

### 채널 전체 조회
- 단축 평가
  - userId ? conn.query(...) : res.status(400).json(...)의 구조는 삼항 연산자를 사용한 단축 평가 작성
  - userId가 존재하는 경우에는 conn.query가 실행되고, userId가 없는 경우에는 바로 400 Bad Request 응답을 반환
- 삼항 연산자
  - 삼항 연산자는 단축 평가와 비슷한 맥락에서 사용 -> userId가 true일 때만 쿼리가 실행되며, 그렇지 않을 경우 오류 응답을 보냄.
 
### 채널 생성 
- userID 값을 숫자로 넣어야하는데 문자열로 넣어도 201 Created 동작하는 문제 해결
- if (channelTitle && userId && !isNaN(userId)){...} : 유효성 검사
  - !isNan(userId) : userId가 숫자인지 확인
  - isNan 함수 : 입력값이 숫자가 아닌 경우 true를 반환한다.
 
## 0228
### 인증과 인가
- 관리자든 고객이든 인증을 통해 사이트에 가입된 사용자라는 것을 증명
- 인증 후에, 페이지 접근 권한을 확인하는 것이 인가

### 쿠키와 세션
- 쿠키 : 웹에서 서버와 클라이언트(브라우저)가 주고받는 데이터 중 하나
  - 장점 : 서버 저장 공간 절약, Staless
  - 단점 : 보안에 취약 -> 해결방안이 세션
- 세션 : 로그인이 되어 있는 상태
  - 장점 : 보안 강화
  - 단점 : 서버 저장 공간 필요, Stateless X
- 쿠키와 세션의 차이점
  - 쿠키 : 브라우저에 저장되는 데이터로, 서버와 클라이언트 간 데이터를 주고받는다.
  - 세션 : 서버에서 관리되는 데이터로, 세션 ID만 쿠키에 저장되고 실제 중요한 정보는 서버에 보관된다.
 
### JWT : 쿠키와 세션의 단점 보완
- JSON 형태의 데이터를 안전하게 전송하기 위한 웹 토큰
- 장점 : 보안에 강하고, Stateless, 서버 부담 감소
- 헤더, 페이로드, 서명으로 구성되어 있는 것을 암호화

### JWT 유효기간 설정
- 유효기가닝 길어지면, 토큰이 탈취되었을 때 위험이 커질 수 있으므로 짧은 유효기간을 설정하는 것이 안전하다!
  ```
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
  ```
  ![image](https://github.com/user-attachments/assets/6aa70898-d144-49a3-b795-5995b665661d)
