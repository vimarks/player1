import { constants } from "./constants.js";
import { Input } from "./input.js";
import { Shuttle } from "./shuttle.js";

export default function(stage) {
  let actions = {};
  let input = new Input(actions);
  let shuttle = new Shuttle(actions);

  // Initialize input events
  input.start(stage);

  // Initialize the shuttle
  shuttle.start(stage);

  // If the window is resized, update the viewbox
  stage.on("viewport", viewport => {
    let aspectRatio = viewport.width / viewport.height;
    let width = aspectRatio * constants.viewboxHeight;
    let height = constants.viewboxHeight;
    stage.viewbox(width, height, "in-pad");
  });
}
