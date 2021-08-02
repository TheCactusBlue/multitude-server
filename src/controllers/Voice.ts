import {Get, JsonController, Post} from "routing-controllers";
import {router} from "../voice";

@JsonController()
class VoiceController {
  // constructor(
  //   private mediaRouter: mediaSoup.Router
  // ) {
  //
  // }

  @Post('/voice/transport')
  async join() {
    return router;
  }
}