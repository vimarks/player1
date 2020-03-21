import { constants } from './constants.js'
import { Input } from './input.js'
import { Shuttle } from './shuttle.js'
import { RockMaker } from './rock.js'

export default function(stage) {
  let input = new Input()
  let rockMaker = new RockMaker()
  let shuttle = new Shuttle(rockMaker, input.source)

  // Initialize input events
  input.start(stage)

  // Initialize the shuttle & rocks
  shuttle.start(stage)
  rockMaker.start(stage)

  // Set the viewbox
  stage.viewbox(
    constants.viewbox.width,
    constants.viewbox.height,
    constants.viewbox.mode || 'in'
  )
}
