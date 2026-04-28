use rocket::serde::json::Json;
use rocket::{delete, get, post, put, routes, Route};
use std::collections::HashMap;
use std::sync::Mutex;

use crate::auth::AuthUser;
use crate::errors::{ApiError, ApiResult};
use crate::schema::{envelope_valid, Deck};

static DECKS: Mutex<Option<HashMap<String, (String, Deck)>>> = Mutex::new(None);

fn with_decks<F, R>(f: F) -> R
where
    F: FnOnce(&mut HashMap<String, (String, Deck)>) -> R,
{
    let mut guard = DECKS.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::new());
    }
    f(guard.as_mut().unwrap())
}

#[get("/decks")]
fn list(user: AuthUser) -> Json<Vec<Deck>> {
    Json(with_decks(|decks| {
        decks
            .values()
            .filter(|(owner, _)| owner == &user.id)
            .map(|(_, d)| d.clone())
            .collect()
    }))
}

#[post("/decks", data = "<deck>")]
fn create(user: AuthUser, deck: Json<Deck>) -> ApiResult<Json<Deck>> {
    if !envelope_valid(&deck) {
        return Err(ApiError::Validation("invalid deck envelope".into()));
    }
    let mut new = deck.into_inner();
    if new.id.is_empty() {
        new.id = uuid::Uuid::new_v4().to_string();
    }
    with_decks(|decks| {
        decks.insert(new.id.clone(), (user.id.clone(), new.clone()));
    });
    Ok(Json(new))
}

#[get("/decks/<id>")]
fn get(user: AuthUser, id: String) -> ApiResult<Json<Deck>> {
    with_decks(|decks| match decks.get(&id) {
        Some((owner, deck)) if owner == &user.id => Ok(Json(deck.clone())),
        Some(_) => Err(ApiError::Unauthorized),
        None => Err(ApiError::NotFound),
    })
}

#[put("/decks/<id>", data = "<deck>")]
fn update(user: AuthUser, id: String, deck: Json<Deck>) -> ApiResult<Json<Deck>> {
    if !envelope_valid(&deck) {
        return Err(ApiError::Validation("invalid deck envelope".into()));
    }
    with_decks(|decks| match decks.get_mut(&id) {
        Some(slot) if slot.0 == user.id => {
            let mut updated = deck.into_inner();
            updated.id = id.clone();
            slot.1 = updated.clone();
            Ok(Json(updated))
        }
        Some(_) => Err(ApiError::Unauthorized),
        None => Err(ApiError::NotFound),
    })
}

#[delete("/decks/<id>")]
fn delete_route(user: AuthUser, id: String) -> ApiResult<()> {
    with_decks(|decks| match decks.get(&id) {
        Some((owner, _)) if owner == &user.id => {
            decks.remove(&id);
            Ok(())
        }
        Some(_) => Err(ApiError::Unauthorized),
        None => Err(ApiError::NotFound),
    })
}

pub fn routes() -> Vec<Route> {
    routes![list, create, get, update, delete_route]
}
