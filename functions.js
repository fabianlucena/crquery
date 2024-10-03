import { op } from './operators.js';
import { Property } from './Property.js';

export const fn = {
  eq:            v => ({ [op.eq]: v }),
  ne:            v => ({ [op.ne]: v }),

  is:            v => ({ [op.is]: v }),
  isNot:         v => ({ [op.isNot]: v }),
  isNull:        v => ({ [op.isNull]: v }),
  isNotNull:     v => ({ [op.isNotNull]: v }),

  gt:            v => ({ [op.gt]: v }),
  ge:            v => ({ [op.ge]: v }),
  lt:            v => ({ [op.lt]: v }),
  le:            v => ({ [op.le]: v }),

  between:       (f, t) => ({ [op.between]: [f, t] }),
  notBetween:    (f, t) => ({ [op.notBetween]: [f, t] }),

  in:            (...v) => ({ [op.in]: v }),
  notIn:         (...v) => ({ [op.notIn]: v }),

  like:          v => ({ [op.like]: v }),
  notLike:       v => ({ [op.notLike]: v }),
  iLike:         v => ({ [op.iLike]: v }),
  notILike:      v => ({ [op.notILike]: v }),

  regexp:        v => ({ [op.regexp]: v }),
  notRegexp:     v => ({ [op.notRegexp]: v }),
  iRegexp:       v => ({ [op.iRegexp]: v }),
  notIRegexp:    v => ({ [op.notIRegexp]: v }),

  startsWith:    v => ({ [op.startsWith]: v }),
  endsWith:      v => ({ [op.endsWith]: v }),
  notStartsWith: v => ({ [op.notStartsWith]: v }),
  notEndsWith:   v => ({ [op.notEndsWith]: v }),
  substring:     v => ({ [op.substring]: v }),
  notSubstring:  v => ({ [op.notSubstring]: v }),

  contains:      v => ({ [op.contains]: v }),
  contained:     v => ({ [op.contained]: v }),
  overlap:       v => ({ [op.overlap]: v }),

  adjacent :     v => ({ [op.adjacent ]: v }),
  strictLeft:    v => ({ [op.strictLeft]: v }),
  strictRight:   v => ({ [op.strictRight]: v }),
  noExtendRight: v => ({ [op.noExtendRight]: v }),
  noExtendLeft:  v => ({ [op.noExtendLeft]: v }),

  anyKeyExists:  v => ({ [op.anyKeyExists]: v }),
  allKeysExist:  v => ({ [op.allKeysExist]: v }),

  match:         v => ({ [op.match]: v }),

  all:           (...v) => ({ [op.all]: v }),
  any:           (...v) => ({ [op.any]: v }),

  and:           (...v) => ({ [op.and]: v }),
  or:            (...v) => ({ [op.or]: v }),

  not:           v => ({ [op.not]: v }),

  property:      v => new Property(v),
};
