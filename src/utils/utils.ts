// 输入转换函数
export function convertInput(input, type) {
  if (!input) return [];

  switch (type) {
    case 'binary':
      if (input.length !== 16) throw new Error('二进制输入必须是16位');
      return [
        parseInt(input.substring(0, 4), 2),
        parseInt(input.substring(4, 8), 2),
        parseInt(input.substring(8, 12), 2),
        parseInt(input.substring(12, 16), 2)
      ];

    case 'hex':
      if (input.length !== 4) throw new Error('十六进制输入必须是4位');
      return [
        parseInt(input.substring(0, 1), 16),
        parseInt(input.substring(1, 2), 16),
        parseInt(input.substring(2, 3), 16),
        parseInt(input.substring(3, 4), 16)
      ];

    case 'ascii':
      if (input.length !== 2) throw new Error('ASCII输入必须是2个字符');
      const char1 = input.charCodeAt(0);
      const char2 = input.charCodeAt(1);
      return [
        (char1 & 0xF0) >> 4,
        char1 & 0x0F,
        (char2 & 0xF0) >> 4,
        char2 & 0x0F
      ];

    default:
      throw new Error('不支持的输入类型');
  }
}

// 输出格式化函数
export function formatOutput(data, type) {
  if (data.length === 0) return '';

  switch (type) {
    case 'binary':
      return data.map(nibble => nibble.toString(2).padStart(4, '0')).join('');

    case 'hex':
      return data.map(nibble => nibble.toString(16).toUpperCase()).join('');

    case 'ascii':
      const char1 = String.fromCharCode((data[0] << 4) | data[1]);
      const char2 = String.fromCharCode((data[2] << 4) | data[3]);
      return char1 + char2;

    default:
      return data.join(' ');
  }
}