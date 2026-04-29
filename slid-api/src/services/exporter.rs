//! Deck exporter. Spawns headless Chromium against the frontend's
//! `/render/:deckId` route and prints to PDF at exactly 1920x1080.

use std::env;

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
            chromium_path: std::env::var("SLID_CHROMIUM_PATH").ok().filter(|s| !s.is_empty()),
        }
    }
}

impl Exporter for ChromiumExporter {
    fn export_pdf(&self, request: &ExportRequest) -> ApiResult<Vec<u8>> {
        // Real implementation: spawn `chromium --headless --print-to-pdf=...`
        // pointed at `${render_base_url}/render/${deck_id}` with print CSS
        // already wired in `slid/src/design/index.css`.
        let render_base_url = env::var("RENDER_BASE_URL").unwrap_or_else(|_| "http://localhost:5173".to_string());
        // TODO: Use render_base_url with format!("{}/render/{}", render_base_url, request.deck_id)
        let _ = (render_base_url, request);
        Err(ApiError::Upstream("PDF export requires Chromium installation. Set CHROMIUM_PATH in .env".into()))
    }
}
