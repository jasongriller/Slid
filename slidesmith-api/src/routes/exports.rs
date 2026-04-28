use rocket::serde::json::Json;
use rocket::{post, routes, Route};
use serde::{Deserialize, Serialize};

use crate::auth::AuthUser;
use crate::errors::{ApiError, ApiResult};
use crate::services::exporter::{ChromiumExporter, ExportRequest, Exporter};

#[derive(Deserialize)]
pub struct PdfBody {
    #[serde(rename = "deckId")]
    deck_id: String,
}

#[derive(Serialize)]
pub struct PdfResponse {
    deck_id: String,
    bytes_written: usize,
}

#[post("/exports/pdf", data = "<body>")]
fn pdf(_user: AuthUser, body: Json<PdfBody>) -> ApiResult<Json<PdfResponse>> {
    let exporter = ChromiumExporter::from_env();
    let request = ExportRequest {
        deck_id: body.deck_id.clone(),
        render_base_url: "http://localhost:5173".into(),
    };
    let pdf = exporter.export_pdf(&request)?;
    Ok(Json(PdfResponse {
        deck_id: body.deck_id.clone(),
        bytes_written: pdf.len(),
    }))
}

#[post("/exports/pptx")]
fn pptx(_user: AuthUser) -> ApiResult<()> {
    Err(ApiError::NotImplemented)
}

pub fn routes() -> Vec<Route> {
    routes![pdf, pptx]
}
