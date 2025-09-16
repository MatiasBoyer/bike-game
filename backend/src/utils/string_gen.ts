const characters = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";

function generate_string(charLen: number) {
  let result = "";
  for (let i = 0; i < charLen; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export { generate_string };
