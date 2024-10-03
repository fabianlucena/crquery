import { op, fn, Value, Property } from './crquery.js';

const defaultOptions = {
  isValue,
  getValue,
  getPropertyName,
  getParser,
  getPrecedence,
  renderOperator,
  getImplicitPropertyName: getPropertyName,
  getImplicitOperator,
  renderGroup,
  trailSpace,
};

export function filter2SQL(filter, options) {
  const keys = Object.keys(filter);
  const symbols = Object.getOwnPropertySymbols(filter);
  if ((keys.length + symbols.length) > 1) {
    let filtersList = [];
    for (const k of keys) {
      filtersList.push({ [k]: filter[k] });
    }

    for (const s of symbols) {
      filtersList.push({ [s]: filter[s] });
    }

    filter = { [op.and]: filtersList };
  }
  
  return _filter2SQL(filter, { ...options, ...defaultOptions }).slice(1);
}

function isValue(value) {
  return Value.isValue(value)
    || typeof value === 'string'
    || typeof value === 'number'
    || value instanceof Date
    || value instanceof String
    || value instanceof Number
    || value instanceof Boolean;
}

function getValue(value, options) {
  if (typeof value === 'undefined'
    || value === null
  ) {
    return ['NULL'];
  }

  if (options.isValue(value)) {
    return ['?', value];
  }
}

function getKeyValue(filter, skipError) {
  const symbols = Object.getOwnPropertySymbols(filter),
    keys = Object.keys(filter),
    total = symbols.length + keys.length;
  if (total > 1) {
    if (skipError) {
      return;
    }

    console.error(filter);
    throw Error('Invalid filter, multiple properties in filter.');
  } else if (!total) {
    if (skipError) {
      return;
    }
    
    console.error(filter);
    throw Error('Invalid filter, no properties in filter.');
  }

  if (keys.length) {
    let key = keys[0];
    if (op[key]) {
      key = op[key];
    }

    return { key, value: filter[keys[0]] };
  }

  if (!symbols.length) {
    if (skipError) {
      return;
    }
    
    console.error(filter);
    throw Error('Invalid filter, expected value or operand.');
  }

  return { key: symbols[0], value: filter[symbols[0]] };
}

function getPropertyName(name) {
  if (Property.isProperty(name)) {
    name = name.name;
  }

  return `"${name}"`;
}

function getParser(key) {
  switch(key) {
  case op.isNull:
  case op.isNotNull: return filter2SQL_unaryOperator;
  case op.is:
  case op.isNot:
  case op.eq:        return filter2SQL_binaryOperator;
  case op.or:
  case op.and:       return filter2SQL_inListOperator;
  }
}

function getPrecedence(operator) {
  switch(operator) {
  case op.eq:
  case op.ne:
  case op.is:
  case op.isNot:
  case op.isNull:
  case op.isNotNull:
  case op.gt:
  case op.ge:
  case op.lt:
  case op.le:
    return 4;

  case op.between:
  case op.notBetween:
  case op.in:
  case op.notIn:
  case op.like:
  case op.notLike:
  case op.iLike:
  case op.notILike:
  case op.regexp:
  case op.notRegexp:
  case op.iRegexp:
  case op.notIRegexp:
  case op.startsWith:
  case op.endsWith:
  case op.notStartsWith:
  case op.notEndsWith:
  case op.substring:
  case op.notSubstring:
  case op.contains:
  case op.contained:
  case op.overlap:
  case op.adjacent:
  case op.strictLeft:
  case op.strictRight:
  case op.noExtendRight:
  case op.noExtendLeft:
  case op.anyKeyExists:
  case op.allKeysExist:
  case op.match:
  case op.all:
  case op.any:
    return 7;

  case op.and:
    return 6;

  case op.or:
    return 7;

  case op.not:
    return 5;
  }

  throw Error(`Invalid filter, unknown precedence for operator: ${operator.toString()}.`);
}

function getImplicitOperator(value) {
  if (value) {
    let nextKey = getKeyValue(value, true)?.key;
    if (typeof nextKey !== 'symbol') {
      return fn.eq(value);
    }
  } else if (value === null) {
    value = fn.isNull();
  }

  return value;
}

function renderOperator(operator, operand, values, options) {
  const binaryOperators = {
    [op.eq]: '=',
    [op.ne]: '!=',
    [op.is]: ' IS ',
    [op.isNot]: ' IS NOT ',
    [op.gt]: '>',
    [op.ge]: '>=',
    [op.lt]: '<',
    [op.le]: '<=',
  };

  const binaryOperator = binaryOperators[operator];
  if (binaryOperator) {
    return [operand[0] + options.trailSpace(binaryOperator) + operand[1], ...values];
  }

  /*case op.between:
  case op.notBetween:
  case op.in:
  case op.notIn:
  case op.like:
  case op.notLike:
  case op.iLike:
  case op.notILike:
  case op.regexp:
  case op.notRegexp:
  case op.iRegexp:
  case op.notIRegexp:
  case op.startsWith:
  case op.endsWith:
  case op.notStartsWith:
  case op.notEndsWith:
  case op.substring:
  case op.notSubstring:
  case op.contains:
  case op.contained:
  case op.overlap:
  case op.adjacent:
  case op.strictLeft:
  case op.strictRight:
  case op.noExtendRight:
  case op.noExtendLeft:
  case op.anyKeyExists:
  case op.allKeysExist:
  case op.match:
  case op.all:
  case op.any:
    return 7;*/

  const listOperators = {
    [op.and]: ' AND ',
    [op.or]:  ' OR ',
    // [op.not]: return '!';
  };

  const listOperator = listOperators[operator];
  if (listOperator) {
    return [operand.join(listOperator), ...values];
  }

  const unaryPosOperators = {
    [op.isNull]: ' IS NULL',
    [op.isNotNull]: ' IS NOT NULL',
  };

  const unaryPosOperator = unaryPosOperators[operator];
  if (unaryPosOperator) {
    return [operand + unaryPosOperator, ...values];
  }

  throw Error(`Invalid filter, unknown render for operator: ${operator.toString()}.`);
}

function renderGroup(value) {
  return '(' + value + ')';
}

function trailSpace(operator) {
  if (!operator.startsWith(' ')) {
    operator = ' ' + operator;
  }

  if (!operator.endsWith(' ')) {
    operator += ' ';
  }

  return operator;
}

function _filter2SQL(filter, options, operand, precedence) {
  let [nextPrecedence, query, ...values] = _rawFilter2SQL(filter, options, operand);
  if (nextPrecedence 
    && precedence
    && nextPrecedence > precedence
  ) {
    query = options.renderGroup(query);
  }

  return [precedence, query, ...values];
}

function _rawFilter2SQL(filter, options, operand) {
  let values = options.getValue(filter, options);
  if (values) {
    return [null, ...values];
  }

  if (Property.isProperty(filter)) {
    return [null, options.getPropertyName(filter)];
  }

  let { key, value } = getKeyValue(filter);

  const parser = options.getParser(key);
  if (parser) {
    return parser(key, operand, value, options);
  }
  
  if (typeof key === 'symbol') {
    console.error(filter);
    throw Error(`Invalid filter, unknown operator: ${key.toString()}.`);
  }

  const property = options.getImplicitPropertyName(key);
  value = options.getImplicitOperator(value);
  
  return _filter2SQL(value, options, property);
}

function filter2SQL_binaryOperator(operator, operand1, operand2, options) {
  if (typeof operand1 === 'undefined') {
    throw Error(`Invalid filter, missing operator1 for binary operator: ${operator.toString()}.`);
  }

  let [precedence, query, ...values] = _filter2SQL(operand2, options, undefined, options.getPrecedence(operator));
  return [precedence, ...options.renderOperator(operator, [operand1, query], values, options)];
}

function filter2SQL_inListOperator(operator, operand1, operand2, options) {
  const queries = [],
    values = [],
    precedence = options.getPrecedence(operator);
  if (typeof operand1 !== 'undefined') {
    queries.push(operand1);
    if (!Array.isArray(operand2)) {
      operand2 = [operand2];
    }
  } else if (!Array.isArray(operand2)) {
    throw Error(`Invalid filter, operator2 must be an array: ${operator.toString()}.`);
  }

  for (const key in operand2) {
    const [, query, ...thisValues] = _filter2SQL(operand2[key], options, undefined, precedence);
    queries.push(query);
    if (thisValues) {
      values.push(...thisValues);
    }
  }

  return [precedence, ...options.renderOperator(operator, queries, values, options)];
}

function filter2SQL_unaryOperator(operator, operand1, operand2, options) {
  let precedence = options.getPrecedence(operator),
    operand,
    values;

  if (typeof operand1 !== 'undefined') {
    if (typeof operand2 !== 'undefined') {
      throw Error(`Invalid filter, operator: ${operator.toString()}, is only for single operand, two provided.`);
    }

    operand = operand1;
    values = [];
  } else {
    if (typeof operand2 === 'undefined') {
      throw Error(`Invalid filter, operator: ${operator.toString()}, need one operand, none provided.`);
    }

    [precedence, operand, ...values] = _filter2SQL(operand2, options, undefined, precedence);
  }

  return [precedence, ...options.renderOperator(operator, operand, values, options)];
}
