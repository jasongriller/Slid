use slid_api::build_rocket;

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();
    let _ = build_rocket().launch().await?;
    Ok(())
}
