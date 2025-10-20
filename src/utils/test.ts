import { encrypt, decrypt } from './saes';
import { doubleEncrypt, doubleDecrypt } from './modes';
import { convertInput, formatOutput } from './utils';

// 运行所有测试用例
export function runAllTests() {
  const results = [];

  // 测试1: 基本加密解密
  const test1Pass = runBasicTest();
  results.push({
    pass: test1Pass,
    message: test1Pass
      ? '基本测试通过: 加密解密功能正常'
      : '基本测试失败: 加密解密功能异常'
  });

  // 测试2: 交叉测试
  const test2Pass = runCrossTest();
  results.push({
    pass: test2Pass,
    message: test2Pass
      ? '交叉测试通过: 算法标准一致'
      : '交叉测试失败: 算法实现不一致'
  });

  // 测试3: ASCII支持
  const test3Pass = runAsciiTest();
  results.push({
    pass: test3Pass,
    message: test3Pass
      ? 'ASCII测试通过: 支持ASCII输入输出'
      : 'ASCII测试失败: ASCII处理异常'
  });

  // 测试4: 双重加密
  const test4Pass = runDoubleEncryptionTest();
  results.push({
    pass: test4Pass,
    message: test4Pass
      ? '双重加密测试通过'
      : '双重加密测试失败'
  });

  // 测试5: CBC模式
  const test5Pass = runCBCTest();
  results.push({
    pass: test5Pass,
    message: test5Pass
      ? 'CBC模式测试通过'
      : 'CBC模式测试失败'
  });

  return results;
}

// 基本加密解密测试
function runBasicTest() {
  const plaintext = [0x4, 0x2, 0xF, 0xA]; // 二进制: 0100 0010 1111 1010
  const key = [0x2, 0x7, 0x8, 0xA];       // 二进制: 0010 0111 1000 1010

  const ciphertext = encrypt(plaintext, key);
  const decrypted = decrypt(ciphertext, key);

  // 验证解密结果与原始明文相同
  return arraysEqual(plaintext, decrypted);
}

// 交叉测试
function runCrossTest() {
  // 使用标准测试向量
  const plaintext = convertInput('0110111101101011', 'binary');
  const key = convertInput('1010011100111011', 'binary');

  const expectedCiphertext = [0x0, 0x4, 0x8, 0x5]; // 二进制: 0000 0100 1000 0101

  const ciphertext = encrypt(plaintext, key);

  return arraysEqual(ciphertext, expectedCiphertext);
}

// ASCII支持测试
function runAsciiTest() {
  const plaintext = 'AB';
  const key = 'K1'; // ASCII密钥

  const plaintextData = convertInput(plaintext, 'ascii');
  const keyData = convertInput(key, 'ascii');

  const ciphertext = encrypt(plaintextData, keyData);
  const decryptedData = decrypt(ciphertext, keyData);
  const decryptedText = formatOutput(decryptedData, 'ascii');

  return plaintext === decryptedText;
}

// 双重加密测试
function runDoubleEncryptionTest() {
  const plaintext = [0x4, 0x2, 0xF, 0xA];
  const key = [0x2, 0x7, 0x8, 0xA, 0x1, 0x3, 0x5, 0x9]; // 32位密钥

  const ciphertext = doubleEncrypt(plaintext, key);
  const decrypted = doubleDecrypt(ciphertext, key);

  return arraysEqual(plaintext, decrypted);
}

// CBC模式测试
function runCBCTest() {
  const plaintext = convertInput('01101111011010110110111101101011', 'binary');
  const key = convertInput('1010011100111011', 'binary');
  const iv = convertInput('0000000000000000', 'binary');

  // 简化的CBC加密
  const ciphertext = cbcEncrypt(plaintext, key, iv);
  const decrypted = cbcDecrypt(ciphertext, key, iv);

  return arraysEqual(plaintext, decrypted);
}

// 辅助函数: 比较两个数组是否相等
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// 简化的CBC加密实现 (仅用于测试)
function cbcEncrypt(plaintext, key, iv) {
  const blockSize = 4;
  let ciphertext = [];
  let previousBlock = iv;

  for (let i = 0; i < plaintext.length; i += blockSize) {
    const block = plaintext.slice(i, i + blockSize);

    // XOR with previous ciphertext block
    const xoredBlock = block.map((val, idx) => val ^ previousBlock[idx]);

    // Encrypt the XORed block
    const encryptedBlock = encrypt(xoredBlock, key);
    ciphertext = ciphertext.concat(encryptedBlock);
    previousBlock = encryptedBlock;
  }

  return ciphertext;
}

// 简化的CBC解密实现 (仅用于测试)
function cbcDecrypt(ciphertext, key, iv) {
  const blockSize = 4;
  let plaintext = [];
  let previousBlock = iv;

  for (let i = 0; i < ciphertext.length; i += blockSize) {
    const block = ciphertext.slice(i, i + blockSize);

    // Decrypt the current block
    const decryptedBlock = decrypt(block, key);

    // XOR with previous ciphertext block
    const xoredBlock = decryptedBlock.map((val, idx) => val ^ previousBlock[idx]);
    plaintext = plaintext.concat(xoredBlock);
    previousBlock = block;
  }

  return plaintext;
}