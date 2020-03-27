import { constants } from './constants.js'
import { Input } from './input.js'
import { Shuttle } from './shuttle.js'
import { RockMaker } from './rock.js'
import { Timer } from './timer.js'

export default function (stage) {
  let input = new Input()
  let rockMaker = new RockMaker()
  let shuttle = new Shuttle(rockMaker, input.source)
  let timer = new Timer(constants.initTimeLimit, 0, 0)

  // Initialize input events
  input.start(stage)

  // Initialize the shuttle, rocks, & timer
  shuttle.start(stage)
  rockMaker.start(stage)
  timer.start(stage)

  // Set the viewbox
  stage.viewbox(
    constants.viewbox.width,
    constants.viewbox.height,
    constants.viewbox.mode || 'in'
  )
}
