# n8n-nodes-nms-prime

Community node **NMS Prime** for self-hosted n8n, scaffolded from the [NMS Prime OpenAPI](https://www.nmsprime.com/swagger.yaml) via `@devlikeapro/n8n-openapi-node`.

> **Scaffold:** Operations and fields are generated from `nodes/NmsPrime/openapi.json`. You may need manual cleanup (operation names, auth, edge-case parameters) depending on how you use the API.

---

## Step-by-step: build on the VPS and install into Docker n8n

Do this on the **same machine where Docker runs n8n** (e.g. SSH into your VPS).  
Install the package **inside the n8n container** under `/home/node/.n8n/nodes` (standard for community nodes). If your instance is configured to load extensions from `/home/node/.n8n/custom`, install there instead. Do not use internal Docker-only paths under `/var/lib/docker/...`.

### 1. Clone and build

```bash
git clone https://github.com/schmto/nmsprime-n8n-node.git
cd nmsprime-n8n-node

npm install
npm run build
npm pack
```

This creates a file like `n8n-nodes-nms-prime-0.1.0.tgz` in the current directory. If your version in `package.json` differs, use that filename in the steps below.

### 2. Find the n8n container

```bash
docker ps
```

Note the **container name** or **ID** in the row where the n8n image runs (examples below use `n8n` — replace with yours).

### 3. Copy the tarball into the container

From the folder that contains the `.tgz`:

```bash
docker cp ./n8n-nodes-nms-prime-0.1.0.tgz n8n:/tmp/
```

### 4. Install the community node inside the container

```bash
docker exec -it n8n sh -c 'mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes && npm install /tmp/n8n-nodes-nms-prime-0.1.0.tgz'
# Or, if you use a custom extensions directory:
# docker exec -it n8n sh -c 'mkdir -p ~/.n8n/custom && cd ~/.n8n/custom && npm install /tmp/n8n-nodes-nms-prime-0.1.0.tgz'
```

### 5. Restart n8n

```bash
docker restart n8n
```

### 6. In the n8n web UI

1. Allow **community nodes** if your instance asks for it ([n8n docs](https://docs.n8n.io/integrations/community-nodes/installation/)).
2. Add the **NMS Prime** node to a workflow.
3. Create credentials **NMS Prime API** (Base URL + username + password for HTTP Basic Auth).

---

## Alternative: laptop build, then copy to the VPS

If you run `npm pack` on your PC:

1. Copy the `.tgz` to the VPS, e.g. `scp n8n-nodes-nms-prime-0.1.0.tgz user@vps:/tmp/`
2. On the VPS: `docker cp /tmp/n8n-nodes-nms-prime-0.1.0.tgz n8n:/tmp/`
3. Continue from **step 4** above.

If `~/.n8n` on the container is a **bind mount** to a folder on the host (e.g. `/docker/n8n`), you can instead run `mkdir -p …/nodes && cd …/nodes && npm install /path/to/n8n-nodes-nms-prime-0.1.0.tgz` on the host (or `…/custom` if that is what your n8n uses) so the files land where the container already reads them.

---

## Credentials

| Field     | Description |
|-----------|-------------|
| Base URL  | Root URL of your NMS Prime instance (scheme + host, no trailing slash). API paths such as `/admin/api/v0/...` come from the bundled OpenAPI spec and are appended to this URL—do not add `/admin/api/v0` to Base URL unless your deployment serves the API under an extra path prefix. |
| Username  | HTTP Basic Auth username |
| Password  | HTTP Basic Auth password (stored masked in n8n) |
| Ignore SSL Issues (Insecure) | When enabled, n8n skips TLS certificate verification for this credential (similar to `curl -k`). Prefer a proper fix: trust your server’s CA or run Node with `--use-system-ca` (Node.js 22+) so the system trust store is used—see **TLS / certificate errors** below. |

Requests send `Authorization: Basic …` (n8n builds the header from username/password) and `Accept: application/json`. The same call can be checked with curl, for example:

```bash
curl -u 'username:password' -H 'Accept: application/json' 'https://your-host/admin/api/v0/Product/2'
```

After upgrading from a Bearer-token release, open existing **NMS Prime API** credentials in the UI and fill username/password (old token fields are no longer used).

### TLS / certificate errors

If executions fail with **unable to verify the first certificate**, Node does not trust the certificate chain (common with self-signed or corporate CAs).

1. **Best:** Install the issuing/root CA where n8n’s Node process can use it, or configure your reverse proxy with a publicly trusted certificate.
2. **Node 22+:** If the CA is already in the OS trust store, try starting Node with `--use-system-ca` (e.g. set `NODE_OPTIONS=--use-system-ca` for the n8n process/container).
3. **Last resort:** In **NMS Prime API** credentials, enable **Ignore SSL Issues (Insecure)** so requests use n8n’s `skipSslCertificateValidation` for that credential only.

---

## Regenerating OpenAPI JSON

If the upstream spec changes:

```bash
curl -skSL "https://www.nmsprime.com/swagger.yaml" -o nodes/NmsPrime/swagger.yaml
node -e "require('fs').writeFileSync('nodes/NmsPrime/openapi.json', JSON.stringify(require('js-yaml').load(require('fs').readFileSync('nodes/NmsPrime/swagger.yaml','utf8'))))"
npm run build
```

(`-k` is only needed if your environment cannot verify the site TLS chain.)
