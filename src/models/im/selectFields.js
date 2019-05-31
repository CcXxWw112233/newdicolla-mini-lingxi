/**
 * // selectFields
 * // model 中选择 state 字段
 * @param {string} domain - state domain(namespace) model 的命名空间
 * @param {function} select - dva effect select 函数
 * @param {array | string} fields - 字段字符串数组 | 字段字符串
 *
 * @returns {object} - 字段作为属性的对象
 */
function* selectFields(domain, select, fields = []) {
  if (typeof fields === 'string') fields = [fields];
  return yield select(state =>
    fields.reduce((acc, curr) => {
      return Object.assign({}, acc, { [curr]: state[domain][curr] });
    }, {})
  );
}

/**
 *
 * @param {function} select - dva effect select 函数
 * @param {array | string} fields - 要选择的字符串数组或者字符串
 *
 * @returns {object}
 */
export const selectFieldsFromIm = function*(select, fields) {
  return yield selectFields('im', select, fields);
};

export default selectFields;
