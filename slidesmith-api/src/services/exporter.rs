//! Deck exporter. Spawns headless Chromium against the frontend's
//! `/render/:deckId` route and prints to PDF at exactly 1920x1080.

use crate::errors::{ApiError, ApiResult};

#[derive(Debug, Clone)]
pub struct ExportRequest {
    pub deck_id: String,
    pub render_base_url: String,
}

pub trait Exporter: Send + Sync {
    fn export_pdf(&self, request: &ExportRequest) -> ApiResult<Vec<u8>>;
}

/// Production exporter — shells out to Chromium.
pub struct ChromiumExporter {
    pub chromium_path: Option<String>,
}

impl ChromiumExporter {
    pub fn from_env() -> Self {
        Self {
            chromium_path: std::env::var("SLIDESMITH_CHROMIUM_PATH").ok().filter(|s| !s.is_empty()),
        }
    }
}

impl Exporter for ChromiumExporter {
    fn export_pdf(&self, _request: &ExportRequest) -> ApiResult<Vec<u8>> {
        // Real implementation: spawn `chromium --headless --print-to-pdf=...`
        // pointed at `${render_base_url}/render/${deck_id}` with print CSS
        // already wired in `slidesmith/src/design/index.css`.
        Err(ApiError::NotImplemented)
    }
}
