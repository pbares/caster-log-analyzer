import { applyPredicatesOnText, formatLine } from './Util.js';

const eol = '\n';
const text = 'A line 1' + eol
    + 'A line 2' + eol
    + 'B line 3' + eol
    + 'C line 4' + eol
    + 'B line 5' + eol
    + 'A line 6' + eol
    ;

it('no predicate', () => {
    const result = applyPredicatesOnText(text, []);
    
    expect(result).toEqual(text);
});

it('single predicate', () => {
    const color = "black";
    const result = applyPredicatesOnText(text, [ {pattern: 'A', color: color} ]);
    const expectedResult = '' 
    + formatLine('A line 1', color) + eol
    + formatLine('A line 2', color) + eol
    + formatLine('A line 6', color) + eol;
    
    expect(result).toEqual(expectedResult);
});

it('several predicates', () => {
    const color = "black";
    const result = applyPredicatesOnText(text, [ 
        {pattern: 'A', color: color},
        {pattern: 'C', color: color} 
    ]);
    const expectedResult = ''
    + formatLine('A line 1', color) + eol
    + formatLine('A line 2', color) + eol
    + formatLine('C line 4', color) + eol
    + formatLine('A line 6', color) + eol;
    
    expect(result).toEqual(expectedResult);
});