// S-AES核心算法实现
const S_BOX = [
  [0x9, 0x4, 0xA, 0xB],
  [0xD, 0x1, 0x8, 0x5],
  [0x6, 0x2, 0x0, 0x3],
  [0xC, 0xE, 0xF, 0x7]
];

const INVERSE_S_BOX = [
  [0xA, 0x5, 0x9, 0xB],
  [0x1, 0x7, 0x8, 0xF],
  [0x6, 0x0, 0x2, 0x3],
  [0xC, 0x4, 0xD, 0xE]
];

// 轮常量
const RCON = [0x80, 0x30];

// 密钥扩展
export function keyExpansion(key) {
  const keys = [key];

  for (let i = 0; i < 2; i++) {
    const prevKey = keys[i];
    const temp = prevKey.slice(2, 4);

    // RotNib
    const rotated = [temp[1], temp[0]];

    // SubNib
    const subNib = [
      substituteNibble(rotated[0]),
      substituteNibble(rotated[1])
    ];

    // XOR with Rcon
    const newWord = [
      prevKey[0] ^ subNib[0] ^ RCON[i],
      prevKey[1] ^ subNib[1]
    ];

    const nextKey = [
      ...newWord,
      newWord[0] ^ prevKey[2],
      newWord[1] ^ prevKey[3]
    ];

    keys.push(nextKey);
  }

  return keys;
}

// 半字节替换
function substituteNibble(nibble) {
  const row = (nibble & 0xC) >> 2;
  const col = nibble & 0x3;
  return S_BOX[row][col];
}

// 逆半字节替换
function inverseSubstituteNibble(nibble) {
  const row = (nibble & 0xC) >> 2;
  const col = nibble & 0x3;
  return INVERSE_S_BOX[row][col];
}

// 行移位
function shiftRows(state) {
  return [
    state[0], state[1],
    state[3], state[2]
  ];
}

// 逆行移位
function inverseShiftRows(state) {
  return shiftRows(state); // 在S-AES中逆移位与移位相同
}

// 列混淆
function mixColumns(state) {
  return [
    state[0] ^ multiply(0x4, state[2]),
    state[1] ^ multiply(0x4, state[3]),
    multiply(0x4, state[0]) ^ state[2],
    multiply(0x4, state[1]) ^ state[3]
  ];
}

// 逆列混淆
function inverseMixColumns(state) {
  return [
    multiply(0x9, state[0]) ^ multiply(0x2, state[2]),
    multiply(0x9, state[1]) ^ multiply(0x2, state[3]),
    multiply(0x2, state[0]) ^ multiply(0x9, state[2]),
    multiply(0x2, state[1]) ^ multiply(0x9, state[3])
  ];
}

// GF(2^4)乘法
function multiply(a, b) {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    if (b & 1) result ^= a;
    const carry = a & 0x8;
    a = (a << 1) & 0xF;
    if (carry) a ^= 0x3;
    b >>= 1;
  }
  return result;
}

// S-AES加密
export function encrypt(plaintext, key) {
  const keys = keyExpansion(key);
  let state = [...plaintext];

  // 初始轮密钥加
  state = addRoundKey(state, keys[0]);

  // 第1轮
  state = state.map(substituteNibble);
  state = shiftRows(state);
  state = mixColumns(state);
  state = addRoundKey(state, keys[1]);

  // 第2轮
  state = state.map(substituteNibble);
  state = shiftRows(state);
  state = addRoundKey(state, keys[2]);

  return state;
}

// S-AES解密
export function decrypt(ciphertext, key) {
  const keys = keyExpansion(key);
  let state = [...ciphertext];

  // 初始轮
  state = addRoundKey(state, keys[2]);
  state = inverseShiftRows(state);
  state = state.map(inverseSubstituteNibble);

  // 第1轮
  state = addRoundKey(state, keys[1]);
  state = inverseMixColumns(state);
  state = inverseShiftRows(state);
  state = state.map(inverseSubstituteNibble);

  // 最终轮密钥加
  state = addRoundKey(state, keys[0]);

  return state;
}

// 轮密钥加
function addRoundKey(state, roundKey) {
  return [
    state[0] ^ roundKey[0],
    state[1] ^ roundKey[1],
    state[2] ^ roundKey[2],
    state[3] ^ roundKey[3]
  ];
}