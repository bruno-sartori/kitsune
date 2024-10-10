use neon::prelude::*;
use neon::types::buffer::TypedArray;

mod services;

fn calculate_file_hash(mut cx: FunctionContext) -> JsResult<JsString> {
    let buffer = cx.argument::<JsBuffer>(0)?;
    let data = buffer.as_slice(&cx);
    let hash = services::calculate_file_hash(data);
    Ok(cx.string(hash))
}

fn merge_chunks(mut cx: FunctionContext) -> JsResult<JsPromise> {
  println!("INITIALIZING");

  let file_name = cx.argument::<JsString>(0)?.value(&mut cx);
  let saved_file_hash = cx.argument::<JsString>(1)?.value(&mut cx);
  let total_chunks = cx.argument::<JsNumber>(2)?.value(&mut cx) as usize;
  let user_id = cx.argument::<JsNumber>(3)?.value(&mut cx) as u8;
  let file_id = cx.argument::<JsString>(4)?.value(&mut cx);

  // Criar um channel Neon para comunicar com o JavaScript
  let (deferred, promise) = cx.promise();

  // Criar um canal Neon para comunicação entre threads
  let channel = cx.channel();

  // Tentar criar um runtime Tokio com tratamento de erro
  let rt = match tokio::runtime::Runtime::new() {
    Ok(runtime) => runtime,
    Err(err) => {
      let err_message = format!("Failed to create Tokio runtime: {}", err);
      let js_err = cx.error(err_message)?;
      deferred.reject(&mut cx, js_err);
      return Ok(promise);
    }
  };

  let future = services::merge_chunks(file_name, saved_file_hash, total_chunks, user_id, file_id);

  // Executar o futuro assíncrono
  rt.spawn(async move {
    match future.await {
      Ok(_) => {
        println!("Future completed successfully.");
        // Resolver a promessa de volta na thread principal
        channel.send(move |mut cx| {
          let undefined = cx.undefined();
          deferred.resolve(&mut cx, undefined);
          Ok(())
        });
      }
      Err(err) => {
        println!("Error occurred: {}", err);
        // Rejeitar a promessa de volta na thread principal
        let err_message = err.to_string();
        channel.send(move |mut cx| {
          let js_err = cx.error(err_message)?;
          deferred.reject(&mut cx, js_err);
          Ok(())
        });
      }
    }
  });

  Ok(promise)
}
/*
fn merge_chunks(mut cx: FunctionContext) -> JsResult<JsString> {
  let file_name: String = cx.argument::<JsString>(0)?.value(&mut cx);
  let saved_file_hash: String = cx.argument::<JsString>(1)?.value(&mut cx);
  let total_chunks: usize = cx.argument::<JsNumber>(2)?.value(&mut cx) as usize;
  let user_id: u8 = cx.argument::<JsNumber>(3)?.value(&mut cx) as u8;
  let file_id: String = cx.argument::<JsString>(4)?.value(&mut cx);

  match services::merge_chunks(file_name, saved_file_hash, total_chunks, user_id, file_id) {
    Ok(()) => Ok(cx.string("Chunks merged successfully")),
    Err(e) => Ok(cx.string(format!("Error: {}", e))),
  }
}
*/

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node 2"))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("calculate_file_hash", calculate_file_hash)?;
    cx.export_function("merge_chunks", merge_chunks)?;
    Ok(())
}
