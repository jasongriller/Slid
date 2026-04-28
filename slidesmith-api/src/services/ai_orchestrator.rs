//! AI orchestrator. Defines a trait so tests can swap in a deterministic
//! implementation, and provides the production OpenAI implementation.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use crate::errors::{ApiError, ApiResult};
use crate::schema::Deck;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Brief {
    pub topic: String,
    pub audience: String,
    pub tone: String,
    #[serde(default)]
    pub outline: Option<String>,
    #[serde(default = "default_slide_count")]
    pub slide_count: u8,
    #[serde(default)]
    pub brand: Option<crate::schema::Brand>,
}

fn default_slide_count() -> u8 {
    8
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegenerateRequest {
    #[serde(rename = "deckId")]
    pub deck_id: String,
    #[serde(rename = "slideIndex")]
    pub slide_index: usize,
    #[serde(default)]
    pub hint: Option<String>,
}

#[async_trait]
pub trait AiOrchestrator: Send + Sync {
    async fn generate_deck(&self, brief: &Brief) -> ApiResult<Deck>;
    async fn regenerate_slide(
        &self,
        request: &RegenerateRequest,
    ) -> ApiResult<serde_json::Value>;
}

/// Production implementation calling OpenAI's structured outputs API.
///
/// The actual HTTP call is intentionally a thin wrapper; the heavy lifting
/// is in the system prompt and the JSON schema constraint.
pub struct OpenAiOrchestrator {
    api_key: String,
}

impl OpenAiOrchestrator {
    pub fn from_env() -> Self {
        Self {
            api_key: std::env::var("SLIDESMITH_OPENAI_API_KEY").unwrap_or_default(),
        }
    }
}

#[async_trait]
impl AiOrchestrator for OpenAiOrchestrator {
    async fn generate_deck(&self, _brief: &Brief) -> ApiResult<Deck> {
        if self.api_key.is_empty() {
            return Err(ApiError::AiFailure(
                "SLIDESMITH_OPENAI_API_KEY is not set".to_string(),
            ));
        }
        // The real implementation would:
        //   1. Build the system prompt (see PROMPTS.md, version 1).
        //   2. Call POST https://api.openai.com/v1/chat/completions with
        //      response_format: { type: "json_schema", json_schema: { ... } }
        //      derived from the TS Zod schema (kept in PROMPTS.md).
        //   3. Validate the response against the Rust envelope check, then
        //      forward the slide bodies to the TS validator (sidecar) which
        //      runs `validateDeck`. Retry once on failure.
        Err(ApiError::NotImplemented)
    }

    async fn regenerate_slide(
        &self,
        _request: &RegenerateRequest,
    ) -> ApiResult<serde_json::Value> {
        if self.api_key.is_empty() {
            return Err(ApiError::AiFailure(
                "SLIDESMITH_OPENAI_API_KEY is not set".to_string(),
            ));
        }
        Err(ApiError::NotImplemented)
    }
}

/// Deterministic in-memory orchestrator used by tests.
pub struct StubOrchestrator {
    pub deck: Deck,
    pub slide: serde_json::Value,
}

#[async_trait]
impl AiOrchestrator for StubOrchestrator {
    async fn generate_deck(&self, _brief: &Brief) -> ApiResult<Deck> {
        Ok(self.deck.clone())
    }
    async fn regenerate_slide(
        &self,
        _request: &RegenerateRequest,
    ) -> ApiResult<serde_json::Value> {
        Ok(self.slide.clone())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::schema::ThemeId;

    fn sample_deck() -> Deck {
        Deck {
            id: "deck-1".into(),
            title: "Sample".into(),
            audience: None,
            tone: None,
            theme: ThemeId::MinimalMono,
            brand: None,
            image_style: None,
            slides: vec![serde_json::json!({"layout":"cover","title":"Hi"})],
        }
    }

    #[tokio::test]
    async fn stub_returns_deck() {
        let stub = StubOrchestrator {
            deck: sample_deck(),
            slide: serde_json::json!({"layout":"cover","title":"Hi"}),
        };
        let brief = Brief {
            topic: "x".into(),
            audience: "y".into(),
            tone: "z".into(),
            outline: None,
            slide_count: 1,
            brand: None,
        };
        let result = stub.generate_deck(&brief).await.unwrap();
        assert_eq!(result.title, "Sample");
    }

    #[tokio::test]
    async fn openai_orchestrator_errors_without_key() {
        std::env::remove_var("SLIDESMITH_OPENAI_API_KEY");
        let orch = OpenAiOrchestrator::from_env();
        let brief = Brief {
            topic: "x".into(),
            audience: "y".into(),
            tone: "z".into(),
            outline: None,
            slide_count: 1,
            brand: None,
        };
        let err = orch.generate_deck(&brief).await.err().unwrap();
        assert!(matches!(err, ApiError::AiFailure(_)));
    }
}
