/**************************************************************
 * Accurate addition, subtraction, multiplication and division.
 *
 * @constructor
 */
const WalletMath = function() {};


WalletMath.add = function(arg1, arg2) {
  return Decimal.add(arg1, arg2);
};

WalletMath.sub = function(arg1, arg2) {
  return Decimal.sub(arg1, arg2);
};

WalletMath.mul = function(arg1, arg2) {
  return Decimal.mul(arg1, arg2);
};

WalletMath.div = function(arg1, arg2) {
  return Decimal.div(arg1, arg2);
};

WalletMath.eq = function(arg1, arg2) {
  return new Decimal(arg1).eq(arg2);
};

WalletMath.lt = function(arg1, arg2) {
  // if (arg1 < arg2) return true;
  return new Decimal(arg1).lessThan(arg2);
};

WalletMath.lessThanOrEqTo = function(arg1, arg2) {
  // if (arg1 <= arg2) return true;
  return new Decimal(arg1).lessThanOrEqualTo(arg2);
};

WalletMath.fixView = function(arg) {
  return arg.toFixed(new Decimal(arg).dp());
};

WalletMath.toHex = function(arg) {
  let retData = new Decimal(arg).toHexadecimal();
  return retData.toString().substring(2); // Del 0x.
};

WalletMath.hexToNumToStr = function(arg) {
  return new Decimal("0x" + arg).toString();
};

WalletMath.toThousands = function (num) {
  let numStart = '';
  let numEnd = '';
  let result = '';
  let dotLocal = num.indexOf(".");

  if (dotLocal === -1) {
    numStart = num;
  } else {
    numStart = num.substr(0, dotLocal);
    numEnd = num.substr(dotLocal);
  }

  while (numStart.length > 3) {
    result = ',' + numStart.slice(-3) + result;
    numStart = numStart.slice(0, numStart.length - 3);
  }
  if (numStart) {
    result = numStart + result;
  }

  return result + numEnd;
};
