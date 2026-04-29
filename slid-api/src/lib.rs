//! Slid API
//!
//! Rocket + SeaORM + JWT backend that orchestrates GPT-4o structured outputs,
//! validates them against the shared `@slid/schema`, composes imagery,
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
use rocket_cors::{AllowedOrigins, CorsOptions};
use std::env;

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
    let allowed_origins = env::var("CORS_ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:5173".to_string());
    let origins: Vec<&str> = allowed_origins.split(',').collect();
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::some_exact(&origins))
        .to_cors()
        .expect("CORS configuration error");

    rocket::build()
        .attach(cors)
        .manage::<Box<dyn AiOrchestrator>>(orchestrator)
        .mount("/", routes::routes())
}
