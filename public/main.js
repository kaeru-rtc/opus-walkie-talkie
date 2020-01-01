if(typeof require != "undefined" && typeof libopus == "undefined"){
  LIBOPUS_WASM_URL = "./wasm/libopus.wasm";
  libopus = require("./wasm/libopus.wasm.js");
}

libopus.onload = _ => {
  console.log("libopus loaded")
}

if(libopus.loaded) {
  libopus.onload()
}