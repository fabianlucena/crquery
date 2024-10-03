import { fn, filter2SQL } from './crquery.js';

let filter = fn.and(
  { 'uno': { '=': 1 }},
  //{ 'dos': 2 },
  //{ 'nulo1': null },
  { 'nulo2': fn.is(null) },
  { 'nulo3': fn.isNull() },
  fn.isNull(fn.property('nulo4')),
  //{ 'noNulo1': fn.isNot(null) },
  //{ 'noNulo2': fn.isNotNull() },
  //fn.isNotNull('noNulo3'),
  //{ 'And1': { [op.and]: 'And2' }},
  fn.or({ 'tres': { '=': 3 }}, { 'cuatro': 4 })
);

console.log('Filter: ');
console.log(filter);

console.log('Result: ');
console.log(filter2SQL(filter));

console.log('Fin');