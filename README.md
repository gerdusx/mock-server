Test JWT keys are committed in `keys/` for local and Docker use (avoids needing openssl in the image on corporate networks).

For local AML demos, `POST /dev/mock-config` accepts
`{"identification":{"anti_money_laundering_01":"watchlist_match"}}`.
Use `pep_match` or `negative_media_match` to return only that match category,
`match_found_compact` for all three, and `no_results` to clear them. The setting
is shared by this mock server and affects future requests only; existing API
results may be cached. The response lists candidates for review, not confirmed
matches.

To regenerate keys (optional):

```bash
# Using Node (no openssl required)
node scripts/generate-keys.cjs
```

Or with openssl:

```bash
mkdir -p mock-server/keys
openssl genrsa -out mock-server/keys/private-key.pem 2048
openssl rsa -in mock-server/keys/private-key.pem -pubout -out mock-server/keys/public-key.pem
```

