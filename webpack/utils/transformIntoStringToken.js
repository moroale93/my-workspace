module.exports = function transformIntoStringToken(params) {
  const result = {};
  Object.keys(params).forEach(paramName => {
    result[paramName] = `\${${paramName}}`;
  });
  return result;
};
