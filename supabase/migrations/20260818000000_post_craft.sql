-- Post Lab: multi-pass generation artifacts.
--
-- The generator now produces a publishing package rather than a body of text:
-- the chosen format, the outline it was written against, the adversarial
-- critique, and the ship artifacts (image prompt, rationale, checklist, CTAs).
-- Existing rows keep working: format defaults to the original shape and the
-- artifact columns are nullable.

alter table public.signal_posts
	add column if not exists format text not null default 'Recognition patterns'
		check (format in (
			'Recognition patterns',
			'Single argument',
			'Field note',
			'Contrarian correction'
		)),
	add column if not exists outline jsonb not null default '[]'::jsonb,
	add column if not exists artifacts jsonb,
	add column if not exists critique jsonb;

comment on column public.signal_posts.format is
	'Structural format the draft was generated against. See lib/signal-room/post-craft.ts.';

comment on column public.signal_posts.artifacts is
	'Publishing package: image prompt, design rationale, ship checklist, CTA variants, defence notes.';

comment on column public.signal_posts.critique is
	'Adversarial critique from the generation pipeline, retained so a revision can be judged against it.';
