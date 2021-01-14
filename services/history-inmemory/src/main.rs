/*
 * Copyright 2020 Fluence Labs Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

mod errors;
mod entry;
mod results;
mod service_api;
mod storage_api;
mod utils;

use fluence::WasmLoggerBuilder;
use storage_api::init;

pub(crate) type Result<T> = std::result::Result<T, errors::HistoryError>;

pub fn main() {
    WasmLoggerBuilder::new()
        .with_log_level(log::Level::Info)
        .build()
        .unwrap();

    match init() {
        Ok(_) => log::info!("db created"),
        Err(e) => log::error!("sqlite db creation failed: {}", e),
    }
}
