const fontFamily = 'font-family: monoscope;';
const fontWeight = 'font-weight: bold;';
const styleMap = {
  primary: `color: #03A9F4; ${fontFamily} ${fontWeight}`,
  success: `color: #00B26A; ${fontFamily} ${fontWeight}`,
  warning: `color: #FFCA3E; ${fontFamily} ${fontWeight}`,
  error: `color: #C41A16; ${fontFamily} ${fontWeight}`
};

/**
 *
 * @param {string | array} text - log content, if not contain style placeHolder, default style will used by whole string.
 *                              - if type is array then as group
 * @param {*} opts - options with log
 * opts:
 * {
 * placeHolder: log style scope
 * logTitle: log title, like ==========\[title\]============, default no title
 * styleType: 'primary' | 'success' | 'warning' | 'error',
 * customStyle: user custom log style, if defined, default styleType will be ignored.
 * }
 */
const log = (
  text = '',
  logTitle = '',
  {
    placeHolder = '%c',
    titleSymbol = '=',
    styleType = 'primary',
    customStyle = {}
  } = {}
) => {

  const standardPlaceHolder = '%c';
  const isArray = i => Array.isArray(i);
  const isStr = str => typeof str === 'string';
  const isNotEmptyStr = str => isStr(str) && str.trim();
  const isSubStrInStr = (str = '', subStr = '') => str && str.includes(subStr);
  const isObj = obj => typeof obj === 'object' && obj !== null && !isArray(obj);
  const isEmptyObj = obj => isObj(obj) && Object.keys(obj).length === 0;
  const isObjPropertyAllStr = (obj = {}) =>
    Object.values(obj).every(i => typeof i === 'string');
  const objToStr = (obj = {}) =>
    isObjPropertyAllStr(obj)
      ? Object.entries(obj).reduce((acc, [key, value]) => {
          if (!acc) return `${key}: ${value};`;
          return `${acc} ${key}: ${value};`;
        }, '')
      : '';

  const isPlaceHolderInStr = (str, placeHolder) =>
    placeHolder && isSubStrInStr(str, placeHolder);

  const wrapStrWithPlaceHolder = (str = '') => `${standardPlaceHolder}${str}`;

  const replacePlaceHolderWithStandardPlaceHolder = (text = '') =>
    text.replace(new RegExp(placeHolder, 'g'), standardPlaceHolder);

  const wrapLogFnWithGroup = (logFn, title = '') => {
    console.group(title);
    logFn();
    console.groupEnd();
  };
  const getStyleStr = (customStyle = {}, styleType = '', styleMap = {}) =>
    isEmptyObj(customStyle) ? styleMap[styleType] : objToStr(customStyle);
  const genStrWithSymbol = (symbol, len = 1) =>
    Array.from({ length: len }, () => symbol).reduce(
      (acc, curr) => `${acc}${curr}`
    );
  const getTitle = (logTitle, titleSymbol) =>
    isNotEmptyStr(logTitle)
      ? `${genStrWithSymbol(titleSymbol, 30)}[${logTitle}]${genStrWithSymbol(
          titleSymbol,
          30
        )}`
      : '';
  const simpleTextLog = (text = '', placeHolder, isShowTitle = false) => {
    if (isPlaceHolderInStr(text, placeHolder)) {
      if (isShowTitle) {
        return console.log(
          replacePlaceHolderWithStandardPlaceHolder(text),
          getStyleStr(customStyle, styleType, styleMap),
          '',
          getTitle(logTitle, titleSymbol)
        );
      } else {
        return console.log(
          replacePlaceHolderWithStandardPlaceHolder(text),
          getStyleStr(customStyle, styleType, styleMap)
        );
      }
    }
    if (!isPlaceHolderInStr(text, placeHolder)) {
      if (isShowTitle) {
        return console.log(
          wrapStrWithPlaceHolder(text),
          getStyleStr(customStyle, styleType, styleMap),
          getTitle(logTitle, titleSymbol)
        );
      } else {
        return console.log(
          wrapStrWithPlaceHolder(text),
          getStyleStr(customStyle, styleType, styleMap)
        );
      }
    }
  };

  if (isStr(text)) {
    return simpleTextLog(
      text,
      placeHolder,
      isNotEmptyStr(logTitle) ? true : false
    );
  }

  if (isArray(text)) {
    const wrappedLogGroup = (text, logTitle) =>
      wrapLogFnWithGroup(
        () =>
          text.map(i => {
            if (isStr(i)) {
              return wrapLogFnWithGroup(
                () => simpleTextLog(i, placeHolder),
                i.substring(0, 10)
              );
            }
            if (isArray(i)) {
              return wrappedLogGroup(i, 'group');
            }
            return wrapLogFnWithGroup(() =>
              simpleTextLog(String(i), placeHolder, String(i).substring(0, 10))
            );
          }),
        `[${logTitle}]`
      );
    return wrappedLogGroup(text, logTitle);
  }

  return simpleTextLog(String(text), placeHolder);
};

const clearLog = () => {
  console.clear();
};

const trace = (text) => {
  console.trace(text)
}

const warn = (text) => {
  console.warn(text)
}
export { log, clearLog, trace, warn };
