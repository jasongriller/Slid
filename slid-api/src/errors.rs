use rocket::http::Status;
use rocket::response::{self, Responder, Response};
use rocket::Request;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("invalid credentials")]
    InvalidCredentials,
    #[error("unauthorized")]
    Unauthorized,
    #[error("not found")]
    NotFound,
    #[error("validation: {0}")]
    Validation(String),
    #[error("ai pipeline failure: {0}")]
    AiFailure(String),
    #[error("upstream: {0}")]
    Upstream(String),
    #[error("internal: {0}")]
    Internal(String),
    #[error("not implemented")]
    NotImplemented,
}

impl ApiError {
    pub fn status(&self) -> Status {
        match self {
            ApiError::InvalidCredentials => Status::Unauthorized,
            ApiError::Unauthorized => Status::Unauthorized,
            ApiError::NotFound => Status::NotFound,
            ApiError::Validation(_) => Status::UnprocessableEntity,
            ApiError::AiFailure(_) => Status::UnprocessableEntity,
            ApiError::Upstream(_) => Status::BadGateway,
            ApiError::Internal(_) => Status::InternalServerError,
            ApiError::NotImplemented => Status::NotImplemented,
        }
    }
}

impl<'r> Responder<'r, 'static> for ApiError {
    fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
        let body = serde_json::json!({ "error": self.to_string() }).to_string();
        Response::build()
            .status(self.status())
            .header(rocket::http::ContentType::JSON)
            .sized_body(body.len(), std::io::Cursor::new(body))
            .ok()
    }
}

pub type ApiResult<T> = Result<T, ApiError>;
