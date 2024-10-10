use sha2::{Sha256, Digest};  // Importa o Digest e o Sha256
use std::path::Path;
use tokio::fs;
use tokio::io::{AsyncWriteExt, BufWriter};
use std::env;

pub fn calculate_file_hash(data: &[u8]) -> String {
  let mut hasher = Sha256::new();
  hasher.update(data);
  let result = hasher.finalize();
  format!("{:x}", result)
}

pub async fn merge_chunks(file_name: String, saved_file_hash: String, total_chunks: usize, user_id: u8, file_id: String) -> Result<(), Box<dyn std::error::Error>> {
  let name = file_name.clone();
    
  println!("===========================================");

  let current_dir = env::current_dir()?;
  println!("Current directory: {}", current_dir.display());
  let chunk_dir = format!("{}/uploads/{}/{}/chunks", current_dir.display(), user_id.to_string(), file_id);
  println!("Chunk directory: {}", chunk_dir);
  let merged_dir_path = format!("{}/uploads/{}/{}/merged", current_dir.display(), user_id.to_string(), file_id);
  println!("Merged file path: {}", merged_dir_path);
  let merged_file_path = format!("{}/{}", merged_dir_path, file_name);


  // Verificar se o diretório de destino existe e criar se necessário
  if !Path::new(&merged_dir_path).exists() {
    println!("Creating directory: {}", merged_dir_path);
    tokio::fs::create_dir_all(&merged_dir_path).await?;
    println!("Directory created: {}", merged_dir_path);
  }

  let file = match tokio::fs::File::create(&merged_file_path).await {
    Ok(file) => {
      println!("File created successfully: {}", merged_file_path);
      file
    },
    Err(err) => {
      eprintln!("Error creating merged file: {}", err);
      return Err(Box::new(err));
    }
  };
  
  println!("AQUIIIII 2");
  let mut write_stream = BufWriter::new(file);
  println!("AQUIIIII 3");

  for i in 0..total_chunks {
    let chunk_file_path = format!("{}/{}.part_{}", chunk_dir, name, i);

    if !Path::new(&chunk_file_path).exists() {
      return Err(format!("File not found: {}", chunk_file_path).into());
    }

    println!("Merging chunk: {}", chunk_file_path);

    let chunk_buffer = fs::read(&chunk_file_path).await?;
    write_stream.write_all(&chunk_buffer).await?;
    fs::remove_file(chunk_file_path).await?;
  }

  write_stream.flush().await?;

  let file_content = fs::read(&merged_file_path).await?;
  let file_hash = calculate_file_hash(&file_content);

  if file_hash != saved_file_hash {
    return Err(format!("Hash mismatch: expected {}, found {}", saved_file_hash, file_hash).into());
  }

  Ok(())
}

/* 
pub fn merge_chunks(file_name: String, saved_file_hash: String, total_chunks: usize, user_id: u8, file_id: String) -> Result<(), Box<dyn std::error::Error>> {
  let chunk_dir = format!("./uploads/{}/{}/chunks", user_id, file_id);
  let merged_file_path = format!("./uploads/{}/{}/merged/{}", user_id, file_id, file_name);

  fs::create_dir_all(Path::new(&merged_file_path).parent().unwrap())?;

  let write_stream = Arc::new(Mutex::new(BufWriter::new(File::create(&merged_file_path)?)));
  let mut handles = vec![];

  for i in 0..total_chunks {
      let write_stream = Arc::clone(&write_stream);
      let chunk_file_path = format!("{}/{}.part_{}", chunk_dir, file_name, i);

      let handle = thread::spawn(move || {
          let chunk_buffer = fs::read(&chunk_file_path).map_err(|e| e.to_string())?;
          let mut stream = write_stream.lock().map_err(|e| e.to_string())?;
          stream.write_all(&chunk_buffer).map_err(|e| e.to_string())?;
          fs::remove_file(chunk_file_path).map_err(|e| e.to_string())?;
          Ok::<(), String>(())
      });

      handles.push(handle);
  }

  for handle in handles {
      handle.join().map_err(|e| {
          // Tenta converter o erro para uma string
          if let Some(err) = e.downcast_ref::<String>() {
              err.clone()
          } else {
              format!("Thread panicked: {:?}", e)
          }
      })??;
  }

  let file_content = fs::read(&merged_file_path)?;
  let file_hash = calculate_file_hash(&file_content);

  if file_hash != saved_file_hash {
      return Err(format!("File hash does not match: {} != {}", file_hash, saved_file_hash).into());
  }

  Ok(())
}
*/
