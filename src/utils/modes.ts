import { encrypt, decrypt } from './saes';

// 双重加密
export function doubleEncrypt(plaintext, key) {
  if (key.length < 8) {
    throw new Error('Double encryption requires 32-bit key');
  }

  const key1 = key.slice(0, 4);
  const key2 = key.slice(4, 8);

  const firstEncryption = encrypt(plaintext, key1);
  return encrypt(firstEncryption, key2);
}

// 双重解密
export function doubleDecrypt(ciphertext, key) {
  if (key.length < 8) {
    throw new Error('Double decryption requires 32-bit key');
  }

  const key1 = key.slice(0, 4);
  const key2 = key.slice(4, 8);

  const firstDecryption = decrypt(ciphertext, key2);
  return decrypt(firstDecryption, key1);
}

// 三重加密
export function tripleEncrypt(plaintext, key) {
  if (key.length < 12) {
    throw new Error('Triple encryption requires 48-bit key');
  }

  const key1 = key.slice(0, 4);
  const key2 = key.slice(4, 8);
  const key3 = key.slice(8, 12);

  const firstEncryption = encrypt(plaintext, key1);
  const secondEncryption = encrypt(firstEncryption, key2);
  return encrypt(secondEncryption, key3);
}

// 三重解密
export function tripleDecrypt(ciphertext, key) {
  if (key.length < 12) {
    throw new Error('Triple decryption requires 48-bit key');
  }

  const key1 = key.slice(0, 4);
  const key2 = key.slice(4, 8);
  const key3 = key.slice(8, 12);

  const firstDecryption = decrypt(ciphertext, key3);
  const secondDecryption = decrypt(firstDecryption, key2);
  return decrypt(secondDecryption, key1);
}