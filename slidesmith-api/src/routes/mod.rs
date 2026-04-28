use rocket::Route;

pub mod ai;
pub mod auth;
pub mod decks;
pub mod exports;
pub mod images;
pub mod index;
pub mod shares;

pub fn routes() -> Vec<Route> {
    let mut all = Vec::new();
    all.extend(index::routes());
    all.extend(auth::routes());
    all.extend(decks::routes());
    all.extend(ai::routes());
    all.extend(images::routes());
    all.extend(exports::routes());
    all.extend(shares::routes());
    all
}
