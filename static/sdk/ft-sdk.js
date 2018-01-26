const ecurve = require('ecurve');
const BigInteger = require('bigi');
const secp256r1 = require('secp256k1');
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58 = require('base-x')(BASE58);

/**
 * Transaction const.
 *
 * @type {string}
 */
const TransactionVersion = '00';
const TransactionType = {
  UserRegister: '04',
  PostArticle: '05',
  LikeArticle: '06',
  ReplyArticle: '07',
  Withdrawal: '08'
};
const ACCURACY_VAL = 100000000;
const ADDRESS_FIRST_CODE = 53;

/**************************************************************************************************
 * Wallet API Class.
 *
 * @constructor
 */
const Wallet = function Wallet() {};

/**
 * Generate privateKey
 *
 * @param $username
 * @param $password
 * @return {*}
 */
Wallet.generatePrivateKey = function($username, $password) {
  return CryptoJS.SHA256(CryptoJS.SHA256($username + $password)).toString();
};

/**
 * PrivateKey generate accountInfo
 *
 * $accountInfo format:
 * privateKey
 * publicKeyEncoded
 * publicKey
 * programHash
 * address
 *
 * @param $privateKey
 * @return {*}
 * @constructor
 */
Wallet.GetAccountInfoFromPrivateKey = function($privateKey) {
  if ($privateKey.length !== 64) return -1;

  let publicKeyEncoded = Wallet.getPublicKey($privateKey, true);
  let script = Wallet.createSignatureScript(publicKeyEncoded);
  let programHash = Wallet.getHash(script);
  let address = Wallet.toAddress(WalletTool.hexStr2ab(programHash.toString()));

  return {
    privateKey: $privateKey,
    publicKeyEncoded: publicKeyEncoded,
    publicKey: publicKeyEncoded.toString('hex'),
    programHash: programHash.toString(),
    address: address
  };
};

/**
 * privateKey to publicKey
 *
 * @param $privateKey
 * @param $encode
 * @return {*}
 */
Wallet.getPublicKey = function($privateKey, $encode) {
  let ecParams = ecurve.getCurveByName('secp256r1');
  let curvePt = ecParams.G.multiply(BigInteger.fromBuffer(WalletTool.hexStr2ab($privateKey)));

  return curvePt.getEncoded($encode);
};

/**
 * @param $signatureScript
 * @return {*}s
 */
Wallet.getHash = function($signatureScript) {
  let ProgramHexString = CryptoJS.enc.Hex.parse($signatureScript);
  let ProgramSha256 = CryptoJS.SHA256(ProgramHexString);

  // 160bit hash，20 BYTE
  return CryptoJS.RIPEMD160(ProgramSha256);
};

/**
 * 21: length; ac: Single sign; ae: More sign
 *
 * @param $publicKeyEncoded
 * @return {string}
 */
Wallet.createSignatureScript = function($publicKeyEncoded) {
  return '21' + $publicKeyEncoded.toString('hex') + 'ac';
};

/**
 * Program hash to address.
 *
 * @param $programHash
 *
 * @return {*}
 */
Wallet.toAddress = function($programHash) {
  let data = new Uint8Array(1 + $programHash.length);
  data.set([ADDRESS_FIRST_CODE]);
  data.set($programHash, 1);

  let ProgramHexString = CryptoJS.enc.Hex.parse(WalletTool.ab2hexStr(data));
  let ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  let ProgramSha256_2 = CryptoJS.SHA256(ProgramSha256);
  let ProgramSha256Buffer = WalletTool.hexStr2ab(ProgramSha256_2.toString());

  let dataArr = new Uint8Array(1 + $programHash.length + 4);
  dataArr.set(data);
  dataArr.set(ProgramSha256Buffer.slice(0, 4), 21);

  return base58.encode(dataArr);
};

/**
 * Address to program hash.
 *
 * @param $address
 * @return {number}
 *
 * @constructor
 */
Wallet.toProgramHash = function($address) {
  let ProgramHash = base58.decode($address);
  let ProgramHexString = CryptoJS.enc.Hex.parse(WalletTool.ab2hexStr(ProgramHash.slice(0, 21)));
  let ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  let ProgramSha256_2 = CryptoJS.SHA256(ProgramSha256);
  let ProgramSha256Buffer = WalletTool.hexStr2ab(ProgramSha256_2.toString());

  if (WalletTool.ab2hexStr(ProgramSha256Buffer.slice(0, 4)) !== WalletTool.ab2hexStr(ProgramHash.slice(21, 25))) {
    return -1;
  }

  return WalletTool.ab2hexStr(ProgramHash.slice(1, 21));
};



/**************************************************************************************************
 * Transaction Class
 *
 * @constructor
 */
const Transaction = function () {};

/**
 * Random num.
 *
 * BYTE                 CONTENT
 * 1                    Transaction attributes count: 01
 * 1                    Transaction attributes usage
 * 8                    Transaction attributes data length
 * data actual length   Transaction attributes data
 */
Transaction.randomNumAttr = function () {
  // Random num
  let attrNum = "01";
  let attrUsage = "00";
  let attrData = WalletTool.ab2hexStr(WalletTool.strToBytes(parseInt(99999999 * Math.random())));
  let attrDataLen = WalletTool.prefixInteger(Number(attrData.length / 2).toString(16), 2);

  return attrNum + attrUsage + attrDataLen + attrData;
};

/**
 * Signature transaction unsigned Data.
 *
 * @param $data
 * @param $privateKey
 *
 * @return {string}
 */
Transaction.signatureData = function($data, $privateKey) {
  let msg = CryptoJS.enc.Hex.parse($data);
  let msgHash = CryptoJS.SHA256(msg);
  let signature = secp256r1.sign(new Buffer(msgHash.toString(), "HEX"), new Buffer($privateKey, "HEX"));

  return signature.signature.toString('hex');
};

/**
 * Increase the signature, public key part, validation script
 *
 * BYTE                       CONTENT
 * 1                          Program length: 0x01
 * 1                          Parameter length
 * parameter actual length 	  Parameter: signature
 * 1			                    Code length
 * code actual length         Code: publicKey
 *
 * @param $txData
 * @param $sign
 * @param $publicKeyEncoded
 * @return {string}
 */
Transaction.addContract = function($txData, $sign, $publicKeyEncoded) {
  // no signature
  if ($sign === '') return $txData + '00'

  // have signature
  let num = "01";
  let structureLen = "41";
  let dataLen = "40";
  let data = $sign;
  let contractDataLen = "23";
  let signatureScript = Wallet.createSignatureScript($publicKeyEncoded);

  return $txData + num + structureLen + dataLen + data + contractDataLen + signatureScript;
};

/**
 * User register.
 *
 * BYTE                     CONTENT
 * 1                        Type: 04
 * 1                        Version: 00
 * 1                        Username length
 * username actual length   Username
 * 20                       Asset owner hash
 * 8                        Reputation
 * this.randomNumAttr       Random num
 * 1                        Transaction input count: 00
 * 1                        Transaction output count: 00
 * 1 	                      Signature: no
 *
 * @param $username
 * @param $honorVal
 * @param $publicKeyEncoded
 * @return {string}
 */
Transaction.userRegister = function($username, $honorVal, $publicKeyEncoded) {
  // Base
  let type = TransactionType.UserRegister;
  let version = TransactionVersion;

  // Username
  let usernameLen = WalletTool.prefixInteger((Number($username.length).toString(16)), 2);
  let username = WalletTool.ab2hexStr(WalletTool.strToBytes($username));

  // 公钥
  let programHash = Wallet.getHash(Wallet.createSignatureScript($publicKeyEncoded)).toString();

  // Honor val
  let honorVal = WalletTool.numStoreInMemory(($honorVal * ACCURACY_VAL).toString(16), 16);

  // Random num
  let attr = this.randomNumAttr();

  // When input or input is 0, there is no additional parameter
  let inputNum = "00";
  let outputNum = "00";

  let txData = type + version
    + usernameLen + username + programHash + honorVal
    + attr + inputNum + outputNum;

  return this.addContract(txData, '', $publicKeyEncoded);
};

/**
 * User post.
 *
 * BYTE                         CONTENT
 * 1                            Type: 05
 * 1                            Version: 00
 * 32                           Hash
 * 1                            Username length
 * username actual length       Username
 * this.randomNumAttr           Random num
 * 1                            Transaction input count: 00
 * 1                            Transaction output count: 00
 * 1 	                          Signature: yes
 *
 * @param $username
 * @param $postContent
 * @param $accountInfo
 * @return {string}
 */
Transaction.postArticle = function($username, $postContent, $accountInfo) {
  // Base
  let type = TransactionType.PostArticle;
  let version = TransactionVersion;

  // Post content
  let postHash = CryptoJS.SHA256($postContent).toString();

  // Username
  let usernameLen = WalletTool.prefixInteger((Number($username.length).toString(16)), 2);
  let username = WalletTool.ab2hexStr(WalletTool.strToBytes($username));

  // Random num
  let attr = this.randomNumAttr();

  // When input or input is 0, there is no additional parameter
  let inputNum = "00";
  let outputNum = "00";

  let txData = type + version
    + postHash + usernameLen + username
    + attr + inputNum + outputNum;

  let signatureData = Transaction.signatureData(txData, $accountInfo.privateKey);

  return this.addContract(txData, signatureData, $accountInfo.publicKeyEncoded);
};

/**
 * User like and hate.
 *
 * BYTE           CONTENT
 * 1              Type: 06
 * 1              Version: 00
 * 32             Hash
 * 1              username length
 * username actual length     username
 * 1              like: 0x00； hate: 0x01
 * this.randomNumAttr  Random num
 * 1              Transaction input count: 00
 * 1              Transaction output count: 00
 * 1 	            Signature: yes
 *
 * @param $username
 * @param $postHash
 * @param $accountInfo
 * @param $isLike
 * @return {string}
 */
Transaction.likeArticle = function($username, $postHash, $accountInfo, $isLike) {
  // Base
  let type = TransactionType.LikeArticle;
  let version = TransactionVersion;

  // Post content
  let postHash = WalletTool.reverseStr($postHash);

  // Username
  let usernameLen = WalletTool.prefixInteger((Number($username.length).toString(16)), 2);
  let username = WalletTool.ab2hexStr(WalletTool.strToBytes($username));

  // Like or hate
  let isLike = $isLike ? '00' : '01'

  // Random num
  let attr = this.randomNumAttr();

  // When input or input is 0, there is no additional parameter
  let inputNum = "00";
  let outputNum = "00";

  let txData = type + version
    + postHash + usernameLen + username + isLike
    + attr + inputNum + outputNum;

  let signatureData = Transaction.signatureData(txData, $accountInfo.privateKey);

  return this.addContract(txData, signatureData, $accountInfo.publicKeyEncoded);
};

/**
 * User reply.
 *
 * BYTE           CONTENT
 * 1              Type: 07
 * 1              Version: 00
 * 32             Hash
 * 32             Reply content hash
 * 1              Username length
 * username actual length     username
 * this.randomNumAttr  Random num
 * 1              Transaction input count: 00
 * 1              Transaction output count: 00
 * 1 	            Signature: yes
 *
 * @param $username
 * @param $postHash
 * @param $replyContent
 * @param $accountInfo
 * @return {string}
 */
Transaction.replyArticle = function($username, $postHash, $replyContent, $accountInfo) {
  // Base
  let type = TransactionType.ReplyArticle;
  let version = TransactionVersion;

  // Post content
  let postHash = WalletTool.reverseStr($postHash);

  // Reply content
  let replyHash = CryptoJS.SHA256($replyContent).toString();

  // Username
  let usernameLen = WalletTool.prefixInteger((Number($username.length).toString(16)), 2);
  let username = WalletTool.ab2hexStr(WalletTool.strToBytes($username));

  // Random num
  let attr = this.randomNumAttr();

  // When input or input is 0, there is no additional parameter
  let inputNum = "00";
  let outputNum = "00";

  let txData = type + version
    + postHash + replyHash + usernameLen + username
    + attr + inputNum + outputNum;

  let signatureData = Transaction.signatureData(txData, $accountInfo.privateKey);

  return this.addContract(txData, signatureData, $accountInfo.publicKeyEncoded);
};

/**
 * Withdrawal
 *
 * BYTE                   CONTENT
 * 1                      Type: 08
 * 1                      Version: 00
 * 1                      Username length
 * username actual length username
 * this.randomNumAttr     Random num
 * 1                      Transaction input count: 00
 * 1                      Transaction output count: 01
 * 32                     Asset ID
 * 8                      Asset num
 * 20                     Asset acceptor ProgramHash
 * 1 	                    Signature: yes
 *
 * @param $username
 * @param $assetID
 * @param $amount
 * @param $toAddress
 * @param $accountInfo
 * @return {string}
 */
Transaction.withdrawal = function($username, $assetID, $amount, $toAddress, $accountInfo) {
  // Base
  let type = TransactionType.Withdrawal;
  let version = TransactionVersion;

  // Username
  let usernameLen = WalletTool.prefixInteger((Number($username.length).toString(16)), 2);
  let username = WalletTool.ab2hexStr(WalletTool.strToBytes($username));

  // Random num
  let attr = this.randomNumAttr();

  // When input or input is 0, there is no additional parameter
  let inputNum = "00";

  // Output Data: Asset ID、Asset num、Asset acceptor ProgramHash
  let outputNum = "01";
  let assetID = WalletTool.reverseStr($assetID);
  let amount = WalletTool.numStoreInMemory(($amount * ACCURACY_VAL).toString(16), 16);
  let programHash = Wallet.toProgramHash($toAddress);

  console.log('assetID:' + assetID)
  console.log('amount:'+amount)
  console.log('programHash:'+programHash)

  let txData = type + version
    + usernameLen + username
    + attr + inputNum
    + outputNum + assetID + amount + programHash;

  let signatureData = Transaction.signatureData(txData, $accountInfo.privateKey);

  return this.addContract(txData, signatureData, $accountInfo.publicKeyEncoded);
};
