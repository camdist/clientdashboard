import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {id:text('id').primaryKey(),kind:text('kind').notNull(),client:text('client').notNull(),payload:text('payload').notNull()},t=>[index('idx_records_kind_client').on(t.kind,t.client)]);
