### after create project, we need to have an account on supabase: https://supabase.com/dashboard/new
### create new organization (kinan-sleman's Org) Type (personal) and plan (Free 0$ month)
### after that create project (Sales Dashboard) with password (s%M/&@?WP#!5@9d) with ragion (Asia Pacific)
### create new table from here (https://supabase.com/dashboard/project/reavppffijnvqcuhexiz/editor) with name (sales_deals) and (checked) on this : (Enable Realtime) and add this columns (Name->type text, value->type int4)
### turn RLS (Row Level Security) off for now for (sales_deals) table from here: (https://supabase.com/dashboard/project/reavppffijnvqcuhexiz/auth/policies?search=sales_deals&schema=public)
### import the file (sales_deals.csv) to your new table
```json
npm install @supabase/supabase-js
```
### Run this command below in supabase SQL Editor to allow postgreSQL aggregates: 
```json
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';
```