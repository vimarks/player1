import { Event } from '../src/event.js'

describe('Event', () => {
  test('sends a full chain of callbacks', () => {
    const ev1 = new Event('event1')
    const ev2 = new Event('event2')
    const ev3 = new Event('event3')
    const ev4 = new Event('event4')
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
})
