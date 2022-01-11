/**
 * @param {string} s
 * @return {number}
 */
Array.prototype.top = function(){
  return this[this.length - 1];
}
Array.prototype.isEmpty = function() {
  return this.length === 0;
}
var romanToInt = function(s) {
  let arry = [];
  for(let i = 0; i < s.length ; i ++) {
      switch(s[i]) {
          case 'I': arry.push(1); break;
          case 'V': 
              // arry.push(1); 
              if(!arry.isEmpty() && arry.top() === 1){
                  arry.pop();
                  arry.push(4);
              }else {
                  arry.push(5);
              }
              break;
          case 'X': 
              if(!arry.isEmpty() && arry.top() === 1){
                  arry.pop();
                  arry.push(9);
              }else {
                  arry.push(10);
              }
              break;
          case 'L': 
              if(!arry.isEmpty() && arry.top() === 10){
                  arry.pop();
                  arry.push(40);
              }else {
                  arry.push(50);
              }
              break;
          case 'C': 
              if(!arry.isEmpty() && arry.top() === 10){
                  arry.pop();
                  arry.push(90);
              }else {
                  arry.push(100);
              }
              break;
          case 'D': 
              if(!arry.isEmpty() && arry.top() === 100){
                  arry.pop();
                  arry.push(400);
              }else {
                  arry.push(500);
              }
              break;
          case 'M': 
              if(!arry.isEmpty() && arry.top() === 100){
                  arry.pop();
                  arry.push(900);
              }else {
                  arry.push(1000);
              }
              break;
          default: continue; break;
      }
  }
  return arry.reduce((pre, curr) => {
      return pre = pre + curr;
  }, 0)
};

console.log(romanToInt('IV'));