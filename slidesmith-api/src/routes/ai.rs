use rocket::serde::json::Json;
use rocket::{post, routes, Route, State};

use crate::auth::AuthUser;
use crate::errors::ApiResult;
use crate::schema::Deck;
use crate::services::ai_orchestrator::{AiOrchestrator, Brief, RegenerateRequest};

#[post("/ai/generate-deck", data = "<brief>")]
async fn generate_deck(
    _user: AuthUser,
    brief: Json<Brief>,
    orchestrator: &State<Box<dyn AiOrchestrator>>,
) -> ApiResult<Json<Deck>> {
    let deck = orchestrator.generate_deck(&brief).await?;
    Ok(Json(deck))
}

#[post("/ai/regenerate-slide", data = "<request>")]
async fn regenerate_slide(
    _user: AuthUser,
    request: Json<RegenerateRequest>,
    orchestrator: &State<Box<dyn AiOrchestrator>>,
) -> ApiResult<Json<serde_json::Value>> {
    let slide = orchestrator.regenerate_slide(&request).await?;
    Ok(Json(slide))
}

pub fn routes() -> Vec<Route> {
    routes![generate_deck, regenerate_slide]
}

#[cfg(test)]
mod tests {
    use crate::schema::{Deck, ThemeId};
    use crate::services::ai_orchestrator::{AiOrchestrator, StubOrchestrator};
    use rocket::http::{ContentType, Status};
    use rocket::local::blocking::Client;

    fn token() -> String {
        std::env::set_var("SLIDESMITH_JWT_SECRET", "ai-test");
        crate::auth::issue_token("test-user", "ai@test.local").unwrap()
    }

    fn stub() -> Box<dyn AiOrchestrator> {
        Box::new(StubOrchestrator {
            deck: Deck {
                id: "stub".into(),
                title: "Stubbed deck".into(),
                audience: None,
                tone: None,
                theme: ThemeId::MinimalMono,
                brand: None,
                image_style: None,
                slides: vec![serde_json::json!({"layout":"cover","title":"Stub"})],
            },
            slide: serde_json::json!({"layout":"cover","title":"Regenerated"}),
        })
    }

    #[test]
    fn generate_deck_round_trip() {
        let client = Client::tracked(crate::build_rocket_with(stub())).unwrap();
        let body = serde_json::json!({
            "topic": "x", "audience": "y", "tone": "z", "slide_count": 1
        }).to_string();
        let res = client
            .post("/ai/generate-deck")
            .header(ContentType::JSON)
            .header(("token", token().as_str()))
            .body(body)
            .dispatch();
        assert_eq!(res.status(), Status::Ok);
        let deck: serde_json::Value = serde_json::from_str(&res.into_string().unwrap()).unwrap();
        assert_eq!(deck.get("title").unwrap(), "Stubbed deck");
    }

    #[test]
    fn regenerate_slide_round_trip() {
        let client = Client::tracked(crate::build_rocket_with(stub())).unwrap();
        let body = serde_json::json!({
            "deckId": "stub", "slideIndex": 0
        }).to_string();
        let res = client
            .post("/ai/regenerate-slide")
            .header(ContentType::JSON)
            .header(("token", token().as_str()))
            .body(body)
            .dispatch();
        assert_eq!(res.status(), Status::Ok);
        let slide: serde_json::Value = serde_json::from_str(&res.into_string().unwrap()).unwrap();
        assert_eq!(slide.get("title").unwrap(), "Regenerated");
    }
}
