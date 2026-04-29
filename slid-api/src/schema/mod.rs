//! Rust mirror of `@slid/schema`.
//!
//! Kept intentionally permissive (uses `serde_json::Value` for slide bodies)
//! so we can validate arbitrary AI output without re-encoding the entire
//! 21-variant discriminated union here. The TypeScript schema package is the
//! source of truth; the AI prompt forces the model to match it.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Brand {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub logo: Option<ImageRef>,
    #[serde(skip_serializing_if = "Option::is_none", rename = "accentColor")]
    pub accent_color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageRef {
    pub src: String,
    pub alt: String,
    pub source: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub credit: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ThemeId {
    MinimalMono,
    Editorial,
    BoldModern,
    CorporateRefined,
    TechGradient,
    SwissGrid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Deck {
    pub id: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub audience: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tone: Option<String>,
    pub theme: ThemeId,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub brand: Option<Brand>,
    #[serde(skip_serializing_if = "Option::is_none", rename = "imageStyle")]
    pub image_style: Option<String>,
    /// Slides are kept as opaque JSON so the canonical Zod schema in TS owns
    /// the per-layout validation. The Rust side only validates the envelope.
    pub slides: Vec<serde_json::Value>,
}

/// Lightweight envelope check the Rust side performs. The full validation is
/// authoritative in TS (`validateDeck`).
pub fn envelope_valid(deck: &Deck) -> bool {
    !deck.title.is_empty() && !deck.slides.is_empty() && deck.slides.len() <= 40
}
