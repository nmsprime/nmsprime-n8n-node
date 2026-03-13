# n8n-nodes-nms-prime

Community node **NMS Prime** for self-hosted n8n, scaffolded from the [NMS Prime OpenAPI](https://www.nmsprime.com/swagger.yaml) via `@devlikeapro/n8n-openapi-node`.

> **Scaffold:** Operations and fields are generated from `nodes/NmsPrime/openapi.json`. You may need manual cleanup (operation names, auth, edge-case parameters) depending on how you use the API.

## Build

```bash
npm install
npm run build
```

Output is emitted under `dist/`.

## Pack & install (self-hosted n8n)

1. From this folder:

   ```bash
   npm pack
   ```

2. In your n8n project (or global install), install the tarball:

   ```bash
   npm install /path/to/n8n-nodes-nms-prime-0.1.0.tgz
   ```

3. Restart n8n. Enable community nodes if required, then add **NMS Prime** and create credentials **NMS Prime API** (Base URL + Bearer Token).

Docker example (install into the image or mounted `~/.n8n` node path—follow [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/installation/)).

## Credentials

| Field        | Description                          |
|-------------|--------------------------------------|
| Base URL    | Root URL of your NMS Prime instance  |
| Bearer Token| API token (sent as `Authorization`) |

## Regenerating OpenAPI JSON

If the upstream spec changes:

```bash
curl -skSL "https://www.nmsprime.com/swagger.yaml" -o nodes/NmsPrime/swagger.yaml
node -e "require('fs').writeFileSync('nodes/NmsPrime/openapi.json', JSON.stringify(require('js-yaml').load(require('fs').readFileSync('nodes/NmsPrime/swagger.yaml','utf8'))))"
npm run build
```

(`-k` is only needed if your environment cannot verify the site TLS chain.)
# nmsprime-n8n-node
