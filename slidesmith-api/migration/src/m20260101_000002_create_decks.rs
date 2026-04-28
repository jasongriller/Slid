use sea_orm_migration::prelude::*;

use crate::m20260101_000001_create_users::Users;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Decks::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Decks::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Decks::OwnerId).uuid().not_null())
                    .col(ColumnDef::new(Decks::Title).string().not_null())
                    .col(ColumnDef::new(Decks::Theme).string().not_null())
                    .col(ColumnDef::new(Decks::Body).json_binary().not_null())
                    .col(ColumnDef::new(Decks::CreatedAt).timestamp_with_time_zone().not_null())
                    .col(ColumnDef::new(Decks::UpdatedAt).timestamp_with_time_zone().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Decks::Table, Decks::OwnerId)
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Decks::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
pub enum Decks {
    Table,
    Id,
    OwnerId,
    Title,
    Theme,
    Body,
    CreatedAt,
    UpdatedAt,
}
