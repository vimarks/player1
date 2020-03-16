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

  // If the window is resized, update the viewbox
  stage.on('viewport', viewport => {
    let aspectRatio = viewport.width / viewport.height
    let width = aspectRatio * constants.viewboxHeight
    let height = constants.viewboxHeight
    stage.viewbox(width, height, 'in-pad')
  })
}
