# AGENTS.md

## What this repo does

Client-side jQuery plugin that renders Unbxd Autosuggest results (in-fields, top queries, keyword suggestions, popular products) for e-commerce search boxes. Merchants embed `unbxdAutosuggest.js` and `unbxdAutosuggest.css` on storefronts; the library calls Unbxd search APIs and renders suggestions via Handlebars templates.


## Architecture

Monolithic browser library — no bundler or module system. Entry point is `unbxdAutoSuggestFunction(jQuery, Handlebars)`, which registers `$.fn.unbxdautocomplete(options)` and an internal `autocomplete` constructor.

**Data flow:** user types in input → debounced XHR to Unbxd autosuggest API (`search.unbxdapi.com` or `search.unbxd.io`, overridable via `searchEndPoint`) → JSON parsed and cached → Handlebars templates render into a dropdown (`unbxd-as-*` CSS classes) → callbacks (`onItemSelect`, `onCartClick`, `onSimpleEnter`) fire on interaction.

**Non-shipping code:** `app.js` + `index_*.html` provide a Ractive-based live configurator demo. `tests/` holds Karma unit tests (mocked JSON) and Puppeteer e2e tests (live API, needs local server on port 7000).

**Release:** GitHub Actions on `release` minifies `unbxdAutosuggest.js` and uploads to S3/CloudFront (`unbxdAutosuggest_v1_test.js` for staging/rc, `unbxdAutosuggest_v1.8.js` for production).

## Folder map

| Folder | Purpose |
|--------|---------|
| `mocks/` | Static JSON API responses for Karma unit tests (`autoSuggestTestResponse.json`, etc.) |
| `tests/screenshots/` | Puppeteer e2e screenshot output (gitkept via `.gitkeep`) |
| `index_*.html` | Demo/configurator pages wiring `app.js` to the plugin |
| `.github/workflows/` | Release pipeline: minify JS, deploy to S3, invalidate CloudFront |
| `bower_components/` | Legacy Bower deps (jquery-zclip, ractive) — gitignored, install via `bower` if needed |

## Key dependencies

- **jQuery + Handlebars (peer/runtime):** Required by consumers and tests. Plugin is initialized via `unbxdAutoSuggestFunction(jQuery, Handlebars)` — not auto-registered.
- **Handlebars (in-plugin):** Built-in default templates compile at runtime; merchants can override per-section via `tpl` options.
- **Karma + Mocha/Chai/Sinon:** Unit tests run headless Chrome via Puppeteer's `CHROME_BIN` override in `karma.conf.js`.
- **Puppeteer + Mocha:** E2e tests (`tests/test_browser*.js`) require `http-server` or Grunt connect on port 7000 before `npm run e2e_test`.
- **Grunt (`grunt` default):** Dev server on port 7000 with livereload for local demo pages.
- **uglify-js:** Used in CI to minify in-place before S3 upload — not part of local dev workflow.

## Environment and config

No `.env` file. Runtime config is passed as options to `$("#input").unbxdautocomplete({ siteName, APIKey, ... })`. Demo pages and e2e tests embed real `siteName`/`APIKey` values inline.

CI secrets (`.github/workflows/main.yaml`): `AWS_GITHUB_OIDC_ROLE_ARN`, `AWS_DEFAULT_REGION`, `AWS_DISTRIBUTION_ID`.

Local test env: `CHROME_BIN` set automatically in `karma.conf.js` from Puppeteer.

## Agent capabilities in this repo

### Autonomous (no confirmation needed):
- Read any file
- Write or edit files inside `unbxdAutosuggest.js`, `unbxdAutosuggest.css`, `app.js`, `index*.html`, `tests/`, `mocks/`, `karma.conf.js`, `Gruntfile.js`
- Run read-only commands: `npm run unit_test`, `npm run e2e_test` (with server running), `grunt` / `npx grunt`, `grep`, `ls`

### Always confirm before doing:
- Deleting any file or directory
- Running database migrations or destructive scripts
- Pushing to remote or opening PRs
- Modifying `.github/workflows/`, `.travis.yml`, or any deploy/infra config
- Triggering or simulating S3/CloudFront deploys
- Any action that touches shared or production systems

## Human checkpoints

- Before changing any public API surface (`unbxdAutoSuggestFunction` signature, `$.fn.unbxdautocomplete` options, callback payloads, `data-type` attributes, exported `Unbxd.autosuggestVersion`)
- Before adding a new dependency to `package.json` or `bower.json`
- Before modifying CI/CD configuration
- Before changing autosuggest API URL construction (`autosuggestUrl`, `getHostDomainName`, query param names)
- Before altering default Handlebars templates or CSS class names (`unbxd-as-*`) — merchants override these
- Before any change that affects CDN-delivered artifacts or cache-busting strategy

- **CDN hosts (merchant-facing):** `https://libraries.unbxdapi.com/` (documented in README) and `https://d21gpk1vhmjuf5.cloudfront.net/` (used in `app.js` demo snippets for `jquery-unbxdautosuggest.js` / `.css`). CI uploads to `s3://unbxd/`; CloudFront serves those objects.
- **Staging artifact:** `unbxdAutosuggest_v1_test.js` — invalidate `/unbxdAutosuggest_v1_test.js`
- **Production artifact:** `unbxdAutosuggest_v1.8.js` — invalidate `/unbxdAutosuggest_v1.8.js` (filename is fixed in workflow, not derived from the release tag)
- **Versioning:** version is encoded in the S3 object name (`_v1_test` vs `_v1.8`), not in query strings. `Unbxd.autosuggestVersion` inside the JS is informational only and does not drive deploy paths.
- **Cache:** S3 objects are uploaded with `Cache-Control: max-age=3600`; workflow always issues a CloudFront invalidation for the deployed path.

- **Trigger:** publishing or editing a GitHub Release runs `.github/workflows/main.yaml`.
- **Staging release:** any release tag containing `rc` → deploys `unbxdAutosuggest_v1_test.js`.
- **Production release:** release `target_commitish` is `master` and tag does **not** contain `rc` → deploys `unbxdAutosuggest_v1.8.js`.
- **Approval:** no extra approval step is defined in this repo — production deploy is gated only by who can publish a GitHub Release against `master`. Confirm team ownership before publishing production releases.

## Anti-patterns

- Do not introduce ES modules, TypeScript, or a bundler without an explicit migration plan — the shipped artifact is a single global script
- Do not call `unbxdautocomplete` before `unbxdAutoSuggestFunction(jQuery, Handlebars)` — the factory must run once first
- Do not break IE-era polyfills or jQuery 1.7+ compatibility without explicit approval
- Do not rename `unbxd-as-*` CSS classes or `data-type` values without coordinating with merchant custom CSS
- Do not add new hardcoded API keys; use placeholders or test mocks
- Do not run `npm run e2e_test` without a server on port 7000 — tests hit `http://localhost:7000/tests/index.html`
- Do not assume `setOption` preserves cache — it clears cache and re-renders
- Do not minify locally and commit the minified output unless matching the release workflow

[FILL: whether minifying in-place during CI (overwriting unbxdAutosuggest.js) is intentional long-term]

## Rules and Skills to create (owner checklist)
<!-- For YOU, the repo owner. Delete this section once Rules and Skills are in place. -->

### Cursor Rules — create in .cursor/rules/ as .mdc files
- [ ] Code style and formatting for this repo (Auto Attached: glob `unbxdAutosuggest.js`, `app.js`, `tests/**`)
- [ ] jQuery plugin and Handlebars template patterns (Auto Attached: glob `unbxdAutosuggest.js`)
- [ ] Security rules: no hardcoded secrets, input validation, auth patterns (Always Apply)
- [ ] Performance rules: debounce/caching conventions in autosuggest (Always Apply)
- [ ] [FILL: any other rule areas specific to this repo, e.g. browser support matrix]

### Skills — create in .claude/skills/ or .cursor/skills/ as .md files
- [ ] Add or modify an autosuggest feature section (inFields, topQueries, keywordSuggestions, popularProducts)
- [ ] Run unit and e2e tests locally (Karma + Puppeteer + dev server)
- [ ] Cut a release and verify S3/CloudFront staging vs production deploy
