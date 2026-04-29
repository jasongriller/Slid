use sea_orm_migration::prelude::*;

use crate::m20260101_000002_create_decks::Decks;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Shares::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Shares::Token).string().not_null().primary_key())
                    .col(ColumnDef::new(Shares::DeckId).uuid().not_null())
                    .col(ColumnDef::new(Shares::CreatedAt).timestamp_with_time_zone().not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Shares::Table, Shares::DeckId)
                            .to(Decks::Table, Decks::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Shares::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
pub enum Shares {
    Table,
    Token,
    DeckId,
    CreatedAt,
}
