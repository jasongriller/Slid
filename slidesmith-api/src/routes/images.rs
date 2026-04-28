use rocket::serde::json::Json;
use rocket::{post, routes, Route};

use crate::auth::AuthUser;
use crate::errors::ApiResult;
use crate::services::image_provider::{ImageProvider, ImageQuery, ProvidedImage, UnsplashOpenAiProvider};

#[post("/images/search", data = "<query>")]
async fn search(_user: AuthUser, query: Json<ImageQuery>) -> ApiResult<Json<ProvidedImage>> {
    let provider = UnsplashOpenAiProvider::from_env();
    Ok(Json(provider.search(&query).await?))
}

#[post("/images/generate", data = "<query>")]
async fn generate(_user: AuthUser, query: Json<ImageQuery>) -> ApiResult<Json<ProvidedImage>> {
    let provider = UnsplashOpenAiProvider::from_env();
    Ok(Json(provider.generate(&query).await?))
}

pub fn routes() -> Vec<Route> {
    routes![search, generate]
}
