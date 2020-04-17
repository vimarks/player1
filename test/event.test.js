import { Event, FilteredEvent } from '../src/event.js'

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
    const stop = new Event()
    const func = jest.fn()

    ev1.until(stop, func)
    ev1.emit('data1')
    ev1.emit('data2')
    stop.emit()
    ev1.emit('data3')

    expect(func.mock.calls).toEqual([['data1'], ['data2']])
  })

  test('trigger an event until another event emits', () => {
    const ev1 = new Event()
    const ev2 = new Event()
    const stop = new Event()
    const func = jest.fn()

    ev1.triggerUntil(stop, ev2)
    ev2.on(func)
    ev1.emit('data1')
    ev1.emit('data2')
    stop.emit()
    ev1.emit('data3')

    expect(func.mock.calls).toEqual([['data1'], ['data2']])
  })

  test('topic events only emit on match', () => {
    const start = new Event()
    const func1 = jest.fn()
    const func2 = jest.fn()

    start.topic('topic1').on(func1)
    start.topic('topic2').on(func2)
    start.emit('topic1', 'data1')
    start.emit('topic2', 'data2')

    expect(func1.mock.calls).toEqual([['data1']])
    expect(func2.mock.calls).toEqual([['data2']])
  })
})
