//! Slidesmith API
//!
//! Rocket + SeaORM + JWT backend that orchestrates GPT-4o structured outputs,
//! validates them against the shared `@slidesmith/schema`, composes imagery,
//! and exports decks to PDF.
//!
//! The library exposes [`build_rocket`] so integration tests can mount the
//! app without spawning a real server.

pub mod auth;
pub mod errors;
pub mod routes;
pub mod schema;
pub mod services;

use rocket::{Build, Rocket};

use crate::services::ai_orchestrator::{AiOrchestrator, OpenAiOrchestrator};

/// Build a Rocket instance with all routes mounted.
///
/// Uses the production OpenAI orchestrator. Tests can use [`build_rocket_with`]
/// to inject a mock orchestrator.
pub fn build_rocket() -> Rocket<Build> {
    build_rocket_with(Box::new(OpenAiOrchestrator::from_env()))
}

/// Build a Rocket instance with a custom AI orchestrator.
pub fn build_rocket_with(orchestrator: Box<dyn AiOrchestrator>) -> Rocket<Build> {
    rocket::build()
        .manage::<Box<dyn AiOrchestrator>>(orchestrator)
        .mount("/", routes::routes())
}
