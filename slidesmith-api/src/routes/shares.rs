use rocket::serde::json::Json;
use rocket::{get, post, routes, Route};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;

use crate::auth::AuthUser;
use crate::errors::{ApiError, ApiResult};

static SHARES: Mutex<Option<HashMap<String, String>>> = Mutex::new(None);

fn with_shares<F, R>(f: F) -> R
where
    F: FnOnce(&mut HashMap<String, String>) -> R,
{
    let mut guard = SHARES.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::new());
    }
    f(guard.as_mut().unwrap())
}

#[derive(Deserialize)]
pub struct CreateShareBody {
    #[serde(rename = "deckId")]
    deck_id: String,
}

#[derive(Serialize)]
pub struct ShareResponse {
    token: String,
    url: String,
}

#[post("/shares", data = "<body>")]
fn create_share(_user: AuthUser, body: Json<CreateShareBody>) -> Json<ShareResponse> {
    let token = uuid::Uuid::new_v4().simple().to_string();
    with_shares(|s| {
        s.insert(token.clone(), body.deck_id.clone());
    });
    Json(ShareResponse {
        url: format!("/render/shared/{token}"),
        token,
    })
}

#[get("/shares/<token>")]
fn resolve(token: String) -> ApiResult<Json<serde_json::Value>> {
    with_shares(|s| match s.get(&token) {
        Some(deck_id) => Ok(Json(serde_json::json!({ "deckId": deck_id }))),
        None => Err(ApiError::NotFound),
    })
}

pub fn routes() -> Vec<Route> {
    routes![create_share, resolve]
}
