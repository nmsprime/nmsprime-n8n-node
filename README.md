# n8n-nodes-nms-prime

Community node **NMS Prime** for self-hosted n8n, scaffolded from the [NMS Prime OpenAPI](https://www.nmsprime.com/swagger.yaml) via `@devlikeapro/n8n-openapi-node`.

> **Scaffold:** Operations and fields are generated from `nodes/NmsPrime/openapi.json`. You may need manual cleanup (operation names, auth, edge-case parameters) depending on how you use the API.

---

## Step-by-step: build on the VPS and install into Docker n8n

Do this on the **same machine where Docker runs n8n** (e.g. SSH into your VPS).  
Install the package **inside the n8n container** under `/home/node/.n8n/nodes` — not under `/var/lib/docker/...` (those paths are internal; ignore them).

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
```

### 5. Restart n8n

```bash
docker restart n8n
```

### 6. In the n8n web UI

1. Allow **community nodes** if your instance asks for it ([n8n docs](https://docs.n8n.io/integrations/community-nodes/installation/)).
2. Add the **NMS Prime** node to a workflow.
3. Create credentials **NMS Prime API** (Base URL + Bearer Token).

---

## Alternative: laptop build, then copy to the VPS

If you run `npm pack` on your PC:

1. Copy the `.tgz` to the VPS, e.g. `scp n8n-nodes-nms-prime-0.1.0.tgz user@vps:/tmp/`
2. On the VPS: `docker cp /tmp/n8n-nodes-nms-prime-0.1.0.tgz n8n:/tmp/`
3. Continue from **step 4** above.

If `~/.n8n` on the container is a **bind mount** to a folder on the host (e.g. `/docker/n8n`), you can instead run `mkdir -p …/nodes && cd …/nodes && npm install /path/to/n8n-nodes-nms-prime-0.1.0.tgz` on the host so the files land where the container already reads them.

---

## Credentials

| Field         | Description                           |
|---------------|---------------------------------------|
| Base URL      | Root URL of your NMS Prime instance   |
| Bearer Token  | API token (sent as `Authorization`)   |

---

## Regenerating OpenAPI JSON

If the upstream spec changes:

```bash
curl -skSL "https://www.nmsprime.com/swagger.yaml" -o nodes/NmsPrime/swagger.yaml
node -e "require('fs').writeFileSync('nodes/NmsPrime/openapi.json', JSON.stringify(require('js-yaml').load(require('fs').readFileSync('nodes/NmsPrime/swagger.yaml','utf8'))))"
npm run build
```

(`-k` is only needed if your environment cannot verify the site TLS chain.)
