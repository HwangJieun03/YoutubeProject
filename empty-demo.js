const obj1 = {};
const obj2 = { message: "값이 있는 객체" };
const num = 1;
const str1 = "one";
const str2 = ""; // 문자열도 객체이다!!

function isEmpty(obj) {
  // if (obj.constructor === Object) //객체인지 확인
  if (Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
}

console.log(isEmpty(obj1)); // length === 0 //true
console.log(isEmpty(obj2)); // length === 1 //false

// console.log(Object.keys(num).length === 0); //true
console.log(isEmpty(str1)); //false
console.log(isEmpty(str2)); //true
