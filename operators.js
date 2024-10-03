export const op = {
  // equality
  eq:            Symbol('eq'),
  ne:            Symbol('ne'),

  // null checking
  is:            Symbol('is'),
  isNot:         Symbol('isNot'),
  isNull:        Symbol('isNull'),
  isNotNull:     Symbol('isNotNull'),

  // comparison
  gt:            Symbol('gt'),
  ge:            Symbol('ge'),

  lt:            Symbol('lt'),
  le:            Symbol('le'),

  // between
  between:       Symbol('between'),
  notBetween:    Symbol('notBetween'),

  // in
  in:            Symbol('in'),
  notIn:         Symbol('notIn'),

  // Strings operators
  like:          Symbol('like'),
  notLike:       Symbol('notLike'),
  iLike:         Symbol('iLike'),
  notILike:      Symbol('notILike'),

  // Regexp operators
  regexp:        Symbol('regexp'),
  notRegexp:     Symbol('notRegexp'),
  iRegexp:       Symbol('iRegexp'),
  notIRegexp:    Symbol('notIRegexp'),

  // Starts, end, and contains operators
  startsWith:    Symbol('startsWith'),
  endsWith:      Symbol('endsWith'),
  notStartsWith: Symbol('notStartsWith'),
  notEndsWith:   Symbol('notEndsWith'),
  substring:     Symbol('substring'),
  notSubstring:  Symbol('notSubstring'),

  // Arrays, ranges, and JSON operators
  contains:      Symbol('contains'),
  contained:     Symbol('contained'),
  overlap:       Symbol('overlap'),

  // Consecutive ranges
  adjacent:      Symbol('adjacent '),
  strictLeft:    Symbol('strictLeft'),
  strictRight:   Symbol('strictRight'),
  noExtendRight: Symbol('noExtendRight'),
  noExtendLeft:  Symbol('noExtendLeft'),

  // JSON operators
  anyKeyExists:  Symbol('anyKeyExists'),
  allKeysExist:  Symbol('allKeysExist'),

  // match a tsvector against a tsquery same of @@ posgre operator
  match:         Symbol('match'),

  // for caombining with oher operators and must satisfy all or some conditions
  all:           Symbol('all'),
  any:           Symbol('any'),

  // logical
  and:           Symbol('and'),
  or:            Symbol('or'),
  not:           Symbol('not'),
};

op['='] =   op.eq;
op['=='] =  op.eq;
op['!='] =  op.ne;
op['<>'] =  op.ne;

op['>'] =   op.gt;
op['>='] =  op.ge;
op.gte =    op.ge;
op['<'] =   op.lt;
op['<='] =  op.lt;
op.lte =    op.lt;

op['@@'] =  op.match;

op['&&'] =  op.and;
op['||'] =  op.or;
op['!'] =   op.not;