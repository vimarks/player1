import * as Trig from '../src/trig.js'

describe('calculateHorizontal', () => {
  test('returns zero for vertical angles', () => {
    expect(Trig.calculateHorizontal(-Math.PI, 10)).toBeCloseTo(0)
    expect(Trig.calculateHorizontal(0, 10)).toBeCloseTo(0)
    expect(Trig.calculateHorizontal(Math.PI, 10)).toBeCloseTo(0)
    expect(Trig.calculateHorizontal(3 * Math.PI, 10)).toBeCloseTo(0)
  })

  test('returns full length for horizontal angles', () => {
    expect(Trig.calculateHorizontal(-Math.PI / 2, 10)).toBeCloseTo(-10)
    expect(Trig.calculateHorizontal(Math.PI / 2, 10)).toBeCloseTo(10)
    expect(Trig.calculateHorizontal((Math.PI * 3) / 2, 10)).toBeCloseTo(-10)
    expect(Trig.calculateHorizontal((Math.PI * 5) / 2, 10)).toBeCloseTo(10)
  })

  test('returns partial length for other angles', () => {
    expect(Trig.calculateHorizontal(Math.PI / 4, 10)).toBeCloseTo(7.071)
    expect(Trig.calculateHorizontal(-Math.PI / 4, 10)).toBeCloseTo(-7.071)
    expect(Trig.calculateHorizontal(Math.PI / 16, 10)).toBeCloseTo(1.951)
    expect(Trig.calculateHorizontal(-Math.PI / 16, 10)).toBeCloseTo(-1.951)
  })
})

describe('calculateVertical', () => {
  test('returns zero for horizontal angles', () => {
    expect(Trig.calculateVertical(-Math.PI / 2, 10)).toBeCloseTo(0)
    expect(Trig.calculateVertical(Math.PI / 2, 10)).toBeCloseTo(0)
    expect(Trig.calculateVertical((Math.PI * 3) / 2, 10)).toBeCloseTo(0)
    expect(Trig.calculateVertical((Math.PI * 5) / 2, 10)).toBeCloseTo(0)
  })

  test('returns full length for vertical angles', () => {
    expect(Trig.calculateVertical(-Math.PI, 10)).toBeCloseTo(10)
    expect(Trig.calculateVertical(0, 10)).toBeCloseTo(-10)
    expect(Trig.calculateVertical(Math.PI, 10)).toBeCloseTo(10)
    expect(Trig.calculateVertical(3 * Math.PI, 10)).toBeCloseTo(10)
  })

  test('returns partial length for other angles', () => {
    expect(Trig.calculateVertical(Math.PI / 4, 10)).toBeCloseTo(-7.071)
    expect(Trig.calculateVertical(-Math.PI / 4, 10)).toBeCloseTo(-7.071)
    expect(Trig.calculateVertical(Math.PI / 16, 10)).toBeCloseTo(-9.808)
    expect(Trig.calculateVertical(-Math.PI / 16, 10)).toBeCloseTo(-9.808)
  })
})

describe('calculateDistance', () => {
  test('returns the hypotenuse length', () => {
    expect(Trig.calculateDistance(5, 5)).toBeCloseTo(7.071)
    expect(Trig.calculateDistance(-5, -5)).toBeCloseTo(7.071)
    expect(Trig.calculateDistance(3, 3, -2, -2)).toBeCloseTo(7.071)
    expect(Trig.calculateDistance(10, 5)).toBeCloseTo(11.18)
  })
})

describe('normalizeAngle', () => {
  test('returns non-negative values only', () => {
    expect(Trig.normalizeAngle(-Math.PI / 4)).toBeCloseTo((Math.PI * 7) / 4)
    expect(Trig.normalizeAngle(-1234)).toBeCloseTo(3.788)
  })

  test('returns values less than 2*pi only', () => {
    expect(Trig.normalizeAngle((Math.PI * 9) / 4)).toBeCloseTo(Math.PI / 4)
    expect(Trig.normalizeAngle(1234)).toBeCloseTo(2.496)
  })
})

describe('calculateAngle', () => {
  test('returns the angle between two points', () => {
    expect(Trig.calculateAngle(0, 0, 5, 5)).toBeCloseTo((Math.PI * 3) / 4)
    expect(Trig.calculateAngle(0, 0, -5, 5)).toBeCloseTo((Math.PI * 5) / 4)
    expect(Trig.calculateAngle(0, 0, 5, -5)).toBeCloseTo(Math.PI / 4)
    expect(Trig.calculateAngle(0, 0, -5, -5)).toBeCloseTo(-Math.PI / 4)
    expect(Trig.calculateAngle(0.12, 0.34, 0.56, 0.78)).toBeCloseTo(2.356)
  })
})

describe('diffAngles', () => {
  test('returns positive angle differences', () => {
    expect(Trig.diffAngles(-Math.PI / 4, Math.PI / 4)).toBeCloseTo(Math.PI / 2)
    expect(Trig.diffAngles(Math.PI, Math.PI / 2)).toBeCloseTo(-Math.PI / 2)
    expect(Trig.diffAngles(0, (Math.PI * 7) / 4)).toBeCloseTo(-Math.PI / 4)
    expect(Trig.diffAngles((Math.PI * 7) / 4, 0)).toBeCloseTo(Math.PI / 4)
  })
})
