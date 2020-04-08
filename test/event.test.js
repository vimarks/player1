import { Event, STALE } from '../src/event.js'

describe('Event', () => {
  test('run a full chain of callbacks', () => {
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

  test('run a callback only once', () => {
    const ev1 = new Event()
    const func = jest.fn()

    ev1.once(func)
    ev1.emit('data1')
    ev1.emit('data2')

    expect(func.mock.calls).toEqual([['data1']])
  })

  test('run a callback until another event emits', () => {
    const ev1 = new Event()
    const ev2 = new Event()
    const func = jest.fn()

    ev1.until(ev2, func)
    ev1.emit('data1')
    ev1.emit('data2')
    ev2.emit('stop')
    ev1.emit('data3')

    expect(func.mock.calls).toEqual([['data1'], ['data2']])
  })
})
