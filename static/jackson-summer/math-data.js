const MATH_DATA = {
  prealgebra: {
    label: 'Pre-Algebra',
    sections: [
      {
        title: 'Integer Operations',
        problems: [
          { q: '(−8) − (−3)', a: '-5' },
          { q: '5 + (−2)', a: '3' },
          { q: '2 + (−1)', a: '1' },
          { q: '2 − (−3)', a: '5' },
          { q: '2 − 1', a: '1' },
          { q: '(−4) + 2', a: '-2' },
          { q: '(−8) + (−6)', a: '-14' },
          { q: '(−7) + 7', a: '0' },
          { q: '(−7) − 4', a: '-11' },
          { q: '4 + (−6)', a: '-2' },
        ]
      },
      {
        title: 'Simplify Fractions',
        problems: [
          { q: '24/42', a: '4/7' },
          { q: '12/16', a: '3/4' },
          { q: '36/96', a: '3/8' },
          { q: '16/28', a: '4/7' },
          { q: '80/140', a: '4/7' },
          { q: '20/60', a: '1/3' },
          { q: '100/160', a: '5/8' },
          { q: '36/42', a: '6/7' },
        ]
      },
      {
        title: 'Greatest Common Factor',
        problems: [
          { q: 'GCF of 21, 35', a: '7' },
          { q: 'GCF of 45, 27', a: '9' },
          { q: 'GCF of 22, 33', a: '11' },
          { q: 'GCF of 42, 10', a: '2' },
          { q: 'GCF of 12, 42', a: '6' },
          { q: 'GCF of 42, 30', a: '6' },
          { q: 'GCF of 28, 12', a: '4' },
          { q: 'GCF of 18, 24', a: '6' },
          { q: 'GCF of 16, 32', a: '16' },
          { q: 'GCF of 48, 24', a: '24' },
        ]
      },
      {
        title: 'Order of Operations',
        problems: [
          { q: '15 ÷ (1 + 4)', a: '3' },
          { q: '5 + 4 × 4', a: '21' },
          { q: '4 × 2 − 1', a: '7' },
          { q: '6 + 1 + 4', a: '11' },
          { q: '6 − 3 + 4', a: '7' },
          { q: '5 × 5 − 6', a: '19' },
          { q: '6 − 2 + 4', a: '8' },
          { q: '6 × 6 − 3', a: '33' },
          { q: '(6 + 1) × 4', a: '28' },
          { q: '3 + 10 ÷ (5 − 3)', a: '8' },
          { q: '3 + 6 − 3 × 2', a: '3' },
          { q: '6(2 + 3 + 3)', a: '48' },
          { q: '4 × 3 × 5 − 1', a: '59' },
          { q: '6 ÷ (4 + 1 − 2)', a: '2' },
          { q: '(9 × 2) ÷ 3', a: '6' },
          { q: '5 ÷ (3 − 1 + 3)', a: '1' },
          { q: '(3 × 2) ÷ (5 − 3)', a: '3' },
          { q: '8 × (18 ÷ 6)', a: '24' },
          { q: '57 + (4 × 2)', a: '65' },
          { q: '(9 × 6) − 38', a: '16' },
        ]
      },
      {
        title: 'Solve Equations',
        problems: [
          { q: 'm − 2 = −18', a: '-16' },
          { q: 'k + 17 = 22', a: '5' },
          { q: '−5 = x − 10', a: '5' },
          { q: '31 = a − 15', a: '46' },
          { q: '−15 = p + 1', a: '-16' },
          { q: '−22 = a − 8', a: '-14' },
          { q: '12 + x = 2', a: '-10' },
          { q: 'n − 18 = −35', a: '-17' },
          { q: '−21 = n − 19', a: '-2' },
          { q: 'n + 11 = 12', a: '1' },
          { q: '8p = 64', a: '8' },
          { q: '4 = 4x', a: '1' },
          { q: '18 = x/12', a: '216' },
          { q: 'n/17 = 8', a: '136' },
          { q: 'n/14 = 4', a: '56' },
          { q: 'm/8 = 18', a: '144' },
          { q: '17x = 323', a: '19' },
        ]
      },
      {
        title: 'Proportions',
        problems: [
          { q: '4/3 and 20/9 — proportion?', a: 'no' },
          { q: '16/8 and 4/2 — proportion?', a: 'yes' },
          { q: '16/12 and 4/3 — proportion?', a: 'yes' },
          { q: '3/2 and 12/4 — proportion?', a: 'no' },
          { q: '8/6 and 4/3 — proportion?', a: 'yes' },
          { q: '4/3 and 20/12 — proportion?', a: 'no' },
          { q: '3/12 = 9/x → x = ?', a: '36' },
          { q: '2/n = 14/7 → n = ?', a: '1' },
          { q: '2/10 = v/6 → v = ?', a: '1.2' },
          { q: '3/p = 2/8 → p = ?', a: '12' },
        ]
      },
      {
        title: 'Order of Operations with Exponents',
        problems: [
          { q: '8 × (13 − 2) − 8²', a: '24' },
          { q: '(32 − 4) ÷ 2 + 3²', a: '23' },
          { q: '(11 − 4)² + (16 ÷ 8)', a: '51' },
          { q: '(32 − 2²) ÷ (2 + 5)', a: '4' },
          { q: '(7 × 5 − 4²) + 7', a: '26' },
          { q: '2 × (9 + 5) + 2²', a: '32' },
          { q: '(54 − 4) ÷ 2 + 2²', a: '29' },
          { q: '(7 + 5)² + (24 ÷ 3)', a: '152' },
          { q: '(10 × 9 − 8²) − 4', a: '22' },
          { q: '(96 − 6²) ÷ (6 − 4)', a: '30' },
        ]
      },
    ]
  },
  algebra1: {
    label: 'Algebra 1',
    sections: [
      { title: 'Coming Soon', problems: [{ q: 'Algebra 1 packet will be loaded from the PDF.', a: '' }] }
    ]
  },
  geometry: {
    label: 'Honors Geometry',
    sections: [
      { title: 'Coming Soon', problems: [{ q: 'Honors Geometry packet will be loaded from the PDF.', a: '' }] }
    ]
  }
};
