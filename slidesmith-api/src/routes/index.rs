use rocket::{get, routes, Route};

#[get("/")]
fn index() -> &'static str {
    "Slidesmith API"
}

pub fn routes() -> Vec<Route> {
    routes![index]
}

#[cfg(test)]
mod tests {
    use crate::services::ai_orchestrator::{AiOrchestrator, StubOrchestrator};
    use crate::schema::{Deck, ThemeId};
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    fn stub() -> Box<dyn AiOrchestrator> {
        Box::new(StubOrchestrator {
            deck: Deck {
                id: "x".into(),
                title: "x".into(),
                audience: None,
                tone: None,
                theme: ThemeId::MinimalMono,
                brand: None,
                image_style: None,
                slides: vec![serde_json::json!({"layout":"cover","title":"Hi"})],
            },
            slide: serde_json::json!({"layout":"cover","title":"Hi"}),
        })
    }

    #[test]
    fn root_returns_greeting() {
        let rocket = crate::build_rocket_with(stub());
        let client = Client::tracked(rocket).expect("rocket");
        let response = client.get("/").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string().unwrap(), "Slidesmith API");
    }
}
