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
