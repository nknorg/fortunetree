const Buffer = require('Buffer');



const WalletTool = function() {};


WalletTool.ab2str = function(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

WalletTool.str2ab = function(str) {
  let bufView = new Uint8Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return bufView;
};

WalletTool.hexStr2ab = function(str) {
  let result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
};

WalletTool.ab2hexStr = function(arr) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i].toString(16);
    str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
    result += str;
  }

  return result;
};

/**
 * 反转数组
 * @param arr
 * @return {Uint8Array}
 */
WalletTool.reverseArr = function(arr) {
  let result = new Uint8Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }

  return result;
};

/**
 * 反转字符串
 * @param str
 */
WalletTool.reverseStr = function(str) {
  return this.ab2hexStr(this.reverseArr(this.hexStr2ab(str)));
};

WalletTool.numStoreInMemory = function(num, length) {
  if (num.length % 2 === 1) {
    num = '0' + num;
  }

  for (let i = num.length; i < length; i++) {
    num = '0' + num;
  }

  return this.ab2hexStr(this.reverseArr(new Buffer(num, "HEX")));
};

WalletTool.strToBytes= function(str) {
  let utf8 = unescape(encodeURIComponent(str));

  let arr = [];
  for (let i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
  }

  return arr;
};

/**
 * fix 0
 *
 * @param num 数字串
 * @param length 需要多长
 * @return {string}
 */
WalletTool.prefixInteger = function(num, length) {
  return (new Array(length).join('0') + num).slice(-length);
};
