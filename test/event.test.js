import { Event } from '../src/event.js'

describe('Event', () => {
  test('sends a full chain of callbacks', () => {
    const start = new Event()
    const ev1 = new Event()
    const ev2 = new Event()
    const ev3 = new Event()
    const ev4 = new Event()
    const func = jest.fn()

    start.trigger(ev1)
    ev1.trigger(ev2, 'event2')
    ev2.trigger(ev3, 'event3').on(func).trigger(ev4, 'event4')
    ev3.on(func)
    ev4.on(func)

    expect(func.mock.calls).toEqual([])
    start.emit('data1')
    expect(func.mock.calls).toEqual([
      ['event3', 'event2', 'data1'],
      ['event2', 'data1'],
      ['event4', 'event2', 'data1'],
    ])
  })

  test('trigger event only during function execution', () => {
    const ev1 = new Event()
    const func = jest.fn()

    ev1.during(function () {
      expect(this).toBe(ev1)
      this.emit('data1')
      this.emit('data2')
    }, func)
    ev1.emit('data3')

    expect(func.mock.calls).toEqual([['data1'], ['data2']])
  })
})
