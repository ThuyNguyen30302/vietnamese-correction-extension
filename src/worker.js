import { env } from "@xenova/transformers";
import { pipeline } from "@xenova/transformers";
env.allowRemoteModels = false;
env.localModelPath = "./models/";
/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
class MyTranslationPipeline {
  static task = "text2text-generation";
  static model = "bmd1905/vico";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.

  let translator = await MyTranslationPipeline.getInstance();

  // Actually perform the translation
  let output = await translator(event.data.text, {
    // Allows for partial output
    // callback_function: (x) => {
    //   self.postMessage({
    //     status: "update",
    //     output: translator.tokenizer
    //       .decode(x[0].output_token_ids, {
    //         skip_special_tokens: true,
    //       })
    //       .replace("<s>", ""),
    //   });
    // },
  });
  // Send the output back to the main thread
  self.postMessage({
    // status: "update",
    output: output,
  });
});
