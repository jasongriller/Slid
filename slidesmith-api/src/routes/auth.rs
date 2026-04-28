use rocket::serde::json::Json;
use rocket::{get, post, routes, Route};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;

use crate::auth::{hash_password, issue_token, verify_password, AuthUser};
use crate::errors::{ApiError, ApiResult};

#[derive(Clone)]
struct StoredUser {
    id: String,
    email: String,
    password_hash: String,
}

/// In-memory user store for the scaffold. Phase 3 swaps this for SeaORM.
/// `Mutex::new` is `const` since Rust 1.63 so no `Lazy` wrapper is needed.
static USERS: Mutex<Option<HashMap<String, StoredUser>>> = Mutex::new(None);

fn with_users<F, R>(f: F) -> R
where
    F: FnOnce(&mut HashMap<String, StoredUser>) -> R,
{
    let mut guard = USERS.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::new());
    }
    f(guard.as_mut().unwrap())
}

#[derive(Deserialize)]
pub struct Credentials {
    email: String,
    password: String,
}

#[derive(Serialize)]
pub struct TokenResponse {
    token: String,
}

#[derive(Serialize)]
pub struct UserDto {
    id: String,
    email: String,
}

#[post("/auth/sign-up", data = "<creds>")]
fn sign_up(creds: Json<Credentials>) -> ApiResult<Json<TokenResponse>> {
    let id = uuid::Uuid::new_v4().to_string();
    let token = with_users(|users| -> ApiResult<String> {
        if users.contains_key(&creds.email) {
            return Err(ApiError::Validation("email already registered".into()));
        }
        let user = StoredUser {
            id: id.clone(),
            email: creds.email.clone(),
            password_hash: hash_password(&creds.password)?,
        };
        users.insert(creds.email.clone(), user);
        issue_token(&id, &creds.email)
    })?;
    Ok(Json(TokenResponse { token }))
}

#[post("/auth/sign-in", data = "<creds>")]
fn sign_in(creds: Json<Credentials>) -> ApiResult<Json<TokenResponse>> {
    let token = with_users(|users| -> ApiResult<String> {
        let Some(user) = users.get(&creds.email) else {
            return Err(ApiError::InvalidCredentials);
        };
        if !verify_password(&creds.password, &user.password_hash) {
            return Err(ApiError::InvalidCredentials);
        }
        issue_token(&user.id, &user.email)
    })?;
    Ok(Json(TokenResponse { token }))
}

#[get("/auth/me")]
fn me(user: AuthUser) -> Json<UserDto> {
    Json(UserDto {
        id: user.id,
        email: user.email,
    })
}

pub fn routes() -> Vec<Route> {
    routes![sign_up, sign_in, me]
}

#[cfg(test)]
mod tests {
    use crate::routes::auth::Credentials;
    use crate::schema::{Deck, ThemeId};
    use crate::services::ai_orchestrator::{AiOrchestrator, StubOrchestrator};
    use rocket::http::{ContentType, Status};
    use rocket::local::blocking::Client;
    use serde_json::Value;

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
    fn sign_up_then_in_then_me_round_trip() {
        std::env::set_var("SLIDESMITH_JWT_SECRET", "round-trip");
        let client = Client::tracked(crate::build_rocket_with(stub())).unwrap();
        let creds = Credentials {
            email: format!("user-{}@test.local", uuid::Uuid::new_v4()),
            password: "hunter22".into(),
        };
        let body = serde_json::to_string(&serde_json::json!({
            "email": creds.email, "password": creds.password
        })).unwrap();

        let res = client
            .post("/auth/sign-up")
            .header(ContentType::JSON)
            .body(&body)
            .dispatch();
        assert_eq!(res.status(), Status::Ok);
        let token: Value = serde_json::from_str(&res.into_string().unwrap()).unwrap();
        let token = token.get("token").unwrap().as_str().unwrap().to_string();

        let res = client.get("/auth/me").header(("token", token.as_str())).dispatch();
        assert_eq!(res.status(), Status::Ok);
        let dto: Value = serde_json::from_str(&res.into_string().unwrap()).unwrap();
        assert_eq!(dto.get("email").unwrap().as_str().unwrap(), creds.email);
    }

    #[test]
    fn me_rejects_missing_token() {
        let client = Client::tracked(crate::build_rocket_with(stub())).unwrap();
        let res = client.get("/auth/me").dispatch();
        assert_eq!(res.status(), Status::Unauthorized);
    }
}
