# `@grass/database` — Postgres schema, migrations, RLS

> **Phase:** draft (Phase 4-5 wire to Supabase Postgres).
> **Owner agent:** architecture.

## What it does

The DB layer is implementation. The **contracts** are in `architecture/twin/` and replicated as
TypeScript types in other `@grass/*` packages. This package owns:

1. **Migrations** (`migrations/*.sql`) — column-by-column mapping to twin-model types.
2. **RLS policies** — row-level security per `Principal.kind` (`customer`, `crew_member`, `steward`, `system`).
3. **Connection helper** — `getClient(principal)` returns a Postgres client whose session is
   authenticated as that principal so RLS policies enforce visibility.

## Schema tables (one per twin model)

| Twin model | Postgres table |
|---|---|
| Customer | `customers` |
| Property | `properties` |
| Service | `services` |
| Crew | `crews`, `crew_members` |
| Equipment | `equipment` |
| Vehicle | `vehicles` |
| Job | `jobs` |
| Invoice | `invoices`, `invoice_line_items` |
| Schedule | `schedules` |
| Route | `routes`, `route_stops` |
| Quote | `quotes`, `quote_line_items` |
| Lead | `leads` |
| Marketing | `marketing_campaigns`, `content_assets` |
| KPI | `kpi_snapshots` |

## RLS example (customers)

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_read_own ON customers
  FOR SELECT USING (
    auth.uid() = id
    OR current_setting('app.principal_kind') = 'steward'
    OR current_setting('app.principal_kind') = 'crew_member'
  );

CREATE POLICY customer_update_own_contact ON customers
  FOR UPDATE USING (
    auth.uid() = id
    AND current_setting('app.principal_kind') = 'customer'
  )
  WITH CHECK (
    -- can only update contact fields, not status/cadence
    (OLD.first_name = NEW.first_name OR NEW.first_name IS NOT NULL)
    AND OLD.status = NEW.status
  );
```

## Migration conventions

- One migration per twin-model change.
- Migrations are forward-only; rollback is a forward migration that restores schema.
- Every migration references a Decision Template entry if the change is irreversible.
- Migrations tracked in `_migrations` table.

## Tests

- `schema.test.ts` — table existence + column types match twin-model contracts
- `rls.test.ts` — RLS policies reject cross-tenant reads