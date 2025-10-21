<template>
  <div class="relative isolated ">
    <img src="../../public/BLK.png" alt="背景图" class="inset-0 absolute -z-10 " />
    <!-- 背景图 -->

    <div class="absolute top-20 left-1/2 -translate-x-1/2 w-full ">
    <div class=" z-10 text-center mb-40">
      <h1 class="text-6xl font-bold text-amber-600 mb-10">你为什么不来试试S-AES加密算法呢</h1>
      <p class="text-2xl text-pink-700">当然是选择Vue和TailwindCSS来构建的简化AES加密工具啦</p>
    </div>
    <!-- 标题文字区域 -->

    <div class="w-full flex justify-evenly ">
      <!-- 输入区域 -->
      <div class="opacity-80 bg-white rounded-xl shadow-lg p-6 mb-8 text-violet-700">
        <div class="grid lg:grid-cols-2 gap-12">
          <div>
            <label class="block text-xl font-bold mb-4">输入类型</label>
            <div class="flex space-x-4">
              <button 
                v-for="type in inputTypes" 
                :key="type.value"
                @click="inputType = type.value"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none ',
                  inputType === type.value 
                    ? 'bg-indigo-600 text-white border-4 border-violet-400' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xl font-bold mb-4">加密模式</label>
            <div class="grid lg:grid-cols-2 gap-2">
              <button 
                v-for="mode in encryptionModes" 
                :key="mode.value"
                @click="encryptionMode = mode.value"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none ',
                  encryptionMode === mode.value 
                    ? 'bg-indigo-600 text-white border-4 border-violet-400' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ mode.label }}
              </button>
            </div>
          </div>
        </div>
        <!-- 选择模式 -->

        <div class="mt-6 space-y-4 tracking-widest">
          <div>
            <label class="block text-xl font-bold mb-2">
              明文 <span class="text-xs text-amber-500">来试试看吧</span>
            </label>
            <input 
              type="text" 
              v-model="plaintext" 
              :placeholder="inputPlaceholder"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xl font-bold mb-2">
              密钥 <span class="text-xs text-amber-500">跟我玩阴滴是吧</span>
            </label>
            <input 
              type="text" 
              v-model="key" 
              placeholder="输入密钥-16位(单重)/32位(双重)/48位(三重)"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div v-if="encryptionMode === 'cbc'">
            <label class="block text-xl font-bold mb-2">
              初始向量 (IV) <span class="text-xs text-amber-500">16位</span>
            </label>
            <input 
              type="text" 
              v-model="iv" 
              placeholder="输入初始向量"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <!-- 输入板块 -->

        <div class="mt-6 flex flex-wrap gap-3">
          <button 
            @click="encryptData"
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            加密
          </button>
          <button 
            @click="decryptData"
            class="px-6 py-3 bg-emerald-400 text-white font-medium rounded-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 transition-colors"
          >
            解密
          </button>
          <button 
            @click="clearAll"
            class="px-6 py-3 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
          >
            清空
          </button>
          <button 
            @click="runTestCases"
            class="px-6 py-3 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            运行测试用例
          </button>
        </div>
        <!-- 运行模块间 -->
      </div>

      <!-- 结果区域 -->
      <div class="opacity-80 bg-white rounded-xl min-w-120 shadow-lg p-6 mb-8 text-violet-700 tracking-widest">
        <h2 class="text-xl font-bold mb-4">加密解密结果</h2>
        
        <div class="grid grid-cols-2 grid-rows-2 gap-6">
          <div class="border-4 border-violet-200 rounded-lg p-4 w-52 h-48">
            <h3 class="text-lg font-bold mb-3 flex items-center">
              <span class="bg-violet-100 text-violet-800 rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              加密结果
            </h3>
            <div class="bg-gray-50 p-4 rounded-md italic font-sans break-all min-h-[80px]">
              {{ ciphertext || '加密结果将显示在这里...' }}
            </div>
          </div>
          
          <div class="border-4 border-violet-200 rounded-lg p-4 w-52 h-48" >
            <h3 class="text-lg font-bold mb-3 flex items-center">
              <span class="bg-emerald-100 text-emerald-800 rounded-full p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              解密结果
            </h3>
            <div class="bg-gray-50 p-4 rounded-md italic font-sans break-all min-h-[80px]">
              {{ decryptedText || '解密结果将显示在这里...' }}
            </div>
          </div>

          <div class="w-52 h-48 ">
            <img src="../../public/poyi.jpg" alt="园丁破译ing" class="border-2 rounded-lg border-violet-200 w-full h-full object-cover" />
          </div>
          <div class="w-52 h-48 ">
            <img src="../../public/lei.png" alt="园丁躺" class="border-2 rounded-lg border-violet-200 w-full h-full object-cover" />
          </div>
          
          
        </div>
      </div>

            <!-- 测试结果 -->
      <div v-if="testResults.length > 0" class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">测试结果</h2>
        
        <div class="space-y-3">
          <div 
            v-for="(result, index) in testResults" 
            :key="index"
            class="flex items-start p-3 rounded-lg"
            :class="result.pass ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
          >
            <span 
              class="mt-1 mr-3 flex-shrink-0"
              :class="result.pass ? 'text-green-500' : 'text-red-500'"
            >
              <svg v-if="result.pass" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </span>
            <span :class="result.pass ? 'text-green-800' : 'text-red-800'">
              {{ result.message }}
            </span>
          </div>
        </div>
      </div>

      </div>
    </div>
  </div>
  
</template>

<script>
import { encrypt, decrypt } from '../utils/saes';
import { doubleEncrypt, doubleDecrypt, tripleEncrypt, tripleDecrypt } from '../utils/modes';
import { runAllTests } from '../utils/test';
import { convertInput, formatOutput } from '../utils/utils';

export default {
  name: 'SAESEncryptor',
  data() {
    return {
      inputType: 'binary',
      plaintext: '',
      key: '',
      iv: '0000000000000000',
      encryptionMode: 'single',
      ciphertext: '',
      decryptedText: '',
      testResults: [],
      inputTypes: [
        { value: 'binary', label: '二进制' },
        { value: 'hex', label: '十六进制' },
        { value: 'ascii', label: 'ASCII' }
      ],
      encryptionModes: [
        { value: 'single', label: '单重加密' },
        { value: 'double', label: '双重加密' },
        { value: 'triple', label: '三重加密' },
        { value: 'cbc', label: 'CBC模式' }
      ]
    };
  },
  computed: {
    inputPlaceholder() {
      switch (this.inputType) {
        case 'binary': return '例如: 0110111101101011';
        case 'hex': return '例如: 6F6B';
        case 'ascii': return '例如: OK';
        default: return '输入数据';
      }
    }
  },
  methods: {
    encryptData() {
      try {
        const inputData = convertInput(this.plaintext, this.inputType);
        const keyData = convertInput(this.key, this.inputType);
        
        let result;
        
        switch (this.encryptionMode) {
          case 'single':
            result = encrypt(inputData, keyData);
            break;
          case 'double':
            // 双重加密使用32位密钥
            const doubleKey = keyData.concat(convertInput('0'.repeat(16), 'binary'));
            result = doubleEncrypt(inputData, doubleKey);
            break;
          case 'triple':
            // 三重加密使用48位密钥
            const tripleKey = keyData.concat(
              convertInput('0'.repeat(16), 'binary'), 
              convertInput('0'.repeat(16), 'binary')
            );
            result = tripleEncrypt(inputData, tripleKey);
            break;
          case 'cbc':
            const ivData = convertInput(this.iv, this.inputType);
            result = this.cbcEncrypt(inputData, keyData, ivData);
            break;
          default:
            result = encrypt(inputData, keyData);
        }
        
        this.ciphertext = formatOutput(result, this.inputType);
      } catch (error) {
        this.showError(`加密错误: ${error.message}`);
      }
    },
    
    decryptData() {
      try {
        const inputData = convertInput(this.ciphertext, this.inputType);
        const keyData = convertInput(this.key, this.inputType);
        
        let result;
        
        switch (this.encryptionMode) {
          case 'single':
            result = decrypt(inputData, keyData);
            break;
          case 'double':
            const doubleKey = keyData.concat(convertInput('0'.repeat(16), 'binary'));
            result = doubleDecrypt(inputData, doubleKey);
            break;
          case 'triple':
            const tripleKey = keyData.concat(
              convertInput('0'.repeat(16), 'binary'), 
              convertInput('0'.repeat(16), 'binary')
            );
            result = tripleDecrypt(inputData, tripleKey);
            break;
          case 'cbc':
            const ivData = convertInput(this.iv, this.inputType);
            result = this.cbcDecrypt(inputData, keyData, ivData);
            break;
          default:
            result = decrypt(inputData, keyData);
        }
        
        this.decryptedText = formatOutput(result, this.inputType);
      } catch (error) {
        this.showError(`解密错误: ${error.message}`);
      }
    },
    
    cbcEncrypt(plaintext, key, iv) {
      // CBC模式加密实现
      const blockSize = 16;
      let ciphertext = [];
      let previousBlock = iv;
      
      for (let i = 0; i < plaintext.length; i += 4) {
        const block = plaintext.slice(i, i + 4);
        
        // XOR with previous ciphertext block (or IV for first block)
        const xoredBlock = [
          block[0] ^ previousBlock[0],
          block[1] ^ previousBlock[1],
          block[2] ^ previousBlock[2],
          block[3] ^ previousBlock[3]
        ];
        
        // Encrypt the XORed block
        const encryptedBlock = encrypt(xoredBlock, key);
        ciphertext = ciphertext.concat(encryptedBlock);
        previousBlock = encryptedBlock;
      }
      
      return ciphertext;
    },
    
    cbcDecrypt(ciphertext, key, iv) {
      // CBC模式解密实现
      const blockSize = 16;
      let plaintext = [];
      let previousBlock = iv;
      
      for (let i = 0; i < ciphertext.length; i += 4) {
        const block = ciphertext.slice(i, i + 4);
        
        // Decrypt the current block
        const decryptedBlock = decrypt(block, key);
        
        // XOR with previous ciphertext block (or IV for first block)
        const xoredBlock = [
          decryptedBlock[0] ^ previousBlock[0],
          decryptedBlock[1] ^ previousBlock[1],
          decryptedBlock[2] ^ previousBlock[2],
          decryptedBlock[3] ^ previousBlock[3]
        ];
        
        plaintext = plaintext.concat(xoredBlock);
        previousBlock = block;
      }
      
      return plaintext;
    },
    
    clearAll() {
      this.plaintext = '';
      this.key = '';
      this.iv = '0000000000000000';
      this.ciphertext = '';
      this.decryptedText = '';
      this.testResults = [];
    },
    
    runTestCases() {
      this.testResults = runAllTests();
    },
    
    showError(message) {
      alert(message);
    }
  }
};
</script>