//! Image provider abstraction: Unsplash + OpenAI Images.
//!
//! Style-consistent prompts: every call carries a deck-level `image_style`
//! descriptor so all imagery in a deck shares mood, color, and subject framing.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use crate::errors::{ApiError, ApiResult};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageQuery {
    pub query: String,
    #[serde(default)]
    pub deck_image_style: Option<String>,
    #[serde(default)]
    pub orientation: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProvidedImage {
    pub src: String,
    pub alt: String,
    pub source: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub credit: Option<String>,
}

#[async_trait]
pub trait ImageProvider: Send + Sync {
    async fn search(&self, query: &ImageQuery) -> ApiResult<ProvidedImage>;
    async fn generate(&self, query: &ImageQuery) -> ApiResult<ProvidedImage>;
}

pub struct UnsplashOpenAiProvider {
    pub unsplash_key: String,
    pub openai_key: String,
}

impl UnsplashOpenAiProvider {
    pub fn from_env() -> Self {
        Self {
            unsplash_key: std::env::var("SLIDESMITH_UNSPLASH_ACCESS_KEY").unwrap_or_default(),
            openai_key: std::env::var("SLIDESMITH_OPENAI_API_KEY").unwrap_or_default(),
        }
    }
}

#[async_trait]
impl ImageProvider for UnsplashOpenAiProvider {
    async fn search(&self, _query: &ImageQuery) -> ApiResult<ProvidedImage> {
        if self.unsplash_key.is_empty() {
            return Err(ApiError::Upstream("Unsplash key not configured".into()));
        }
        Err(ApiError::NotImplemented)
    }

    async fn generate(&self, _query: &ImageQuery) -> ApiResult<ProvidedImage> {
        if self.openai_key.is_empty() {
            return Err(ApiError::Upstream("OpenAI key not configured".into()));
        }
        Err(ApiError::NotImplemented)
    }
}
