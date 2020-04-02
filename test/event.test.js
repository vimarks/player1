import { Event } from '../src/event.js'

describe('Event', () => {
  test('sends a full chain of callbacks', () => {
    const ev1 = new Event(['event1'])
    const ev2 = new Event(['event2'])
    const ev3 = new Event(['event3'])
    const ev4 = new Event(['event4'])
    const func = jest.fn()

    ev1.trigger(ev2)
    ev2.trigger(ev3).on(func).trigger(ev4)
    ev3.on(func)
    ev4.on(func)

    expect(func.mock.calls).toEqual([])
    ev1.emit('data')
    expect(func.mock.calls).toEqual([
      ['event3', 'event2', 'event1', 'data'],
      ['event2', 'event1', 'data'],
      ['event4', 'event2', 'event1', 'data'],
    ])
  })

  test('bindPre overrides preArgs', () => {
    const ev = new Event(['test1', 'test2'])
    const func1 = jest.fn()
    const func2 = jest.fn()
    const func3 = jest.fn()

    ev.on(func1).emit('data')
    expect(func1.mock.calls).toEqual([['test1', 'test2', 'data']])

    ev.on(func2).bindPre(['test3'], () => ev.emit('data'))
    expect(func2.mock.calls).toEqual([['test3', 'data']])

    ev.on(func3).emit('data')
    expect(func3.mock.calls).toEqual([['test1', 'test2', 'data']])
  })
})
