//! JWT issuance, verification, password hashing, and the `AuthUser` request guard.

use argon2::password_hash::{PasswordHasher, PasswordVerifier, SaltString};
use argon2::{Argon2, PasswordHash};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use rand::rngs::OsRng;
use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};
use serde::{Deserialize, Serialize};

use crate::errors::ApiError;

/// Hours a token is valid for, mirrors bookstore's 4 hours.
pub const TOKEN_LIFETIME_HOURS: i64 = 4;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub email: String,
    pub exp: usize,
}

fn jwt_secret() -> String {
    std::env::var("SLIDESMITH_JWT_SECRET").unwrap_or_else(|_| "dev-secret".to_string())
}

pub fn issue_token(user_id: &str, email: &str) -> Result<String, ApiError> {
    let exp = (Utc::now() + Duration::hours(TOKEN_LIFETIME_HOURS)).timestamp() as usize;
    let claims = Claims {
        sub: user_id.to_string(),
        email: email.to_string(),
        exp,
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret().as_bytes()),
    )
    .map_err(|e| ApiError::Internal(e.to_string()))
}

pub fn verify_token(token: &str) -> Result<Claims, ApiError> {
    let data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret().as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| ApiError::Unauthorized)?;
    Ok(data.claims)
}

pub fn hash_password(plain: &str) -> Result<String, ApiError> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(plain.as_bytes(), &salt)
        .map(|h| h.to_string())
        .map_err(|e| ApiError::Internal(e.to_string()))
}

pub fn verify_password(plain: &str, hashed: &str) -> bool {
    let parsed = match PasswordHash::new(hashed) {
        Ok(p) => p,
        Err(_) => return false,
    };
    Argon2::default()
        .verify_password(plain.as_bytes(), &parsed)
        .is_ok()
}

#[derive(Debug)]
pub struct AuthUser {
    pub id: String,
    pub email: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthUser {
    type Error = ApiError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let header = req.headers().get_one("token");
        let Some(token) = header else {
            return Outcome::Error((Status::Unauthorized, ApiError::Unauthorized));
        };
        match verify_token(token) {
            Ok(claims) => Outcome::Success(AuthUser {
                id: claims.sub,
                email: claims.email,
            }),
            Err(_) => Outcome::Error((Status::Unauthorized, ApiError::Unauthorized)),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_and_verify_round_trip() {
        let h = hash_password("hunter2").unwrap();
        assert!(verify_password("hunter2", &h));
        assert!(!verify_password("nope", &h));
    }

    #[test]
    fn issue_and_verify_jwt_round_trip() {
        std::env::set_var("SLIDESMITH_JWT_SECRET", "test-secret");
        let token = issue_token("user-1", "a@b.test").unwrap();
        let claims = verify_token(&token).unwrap();
        assert_eq!(claims.sub, "user-1");
        assert_eq!(claims.email, "a@b.test");
    }

    #[test]
    fn verify_rejects_garbage() {
        assert!(verify_token("not-a-token").is_err());
    }
}
