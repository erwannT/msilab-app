# msilab-app

## Required configuration

The frontend requires `VITE_POCKETBASE_URL` at startup/build time.
No default PocketBase URL is embedded in the code.

1. Copy `.env.example` to `.env`.
2. Set `VITE_POCKETBASE_URL` to the target PocketBase base URL.

## CI/CD Deployment

For deployments via the GitHub Actions workflow (`deploy.yml`), you must configure the variable `VITE_POCKETBASE_URL` in your GitHub repository:
- Go to **Settings > Secrets and variables > Actions**.
- Under the **Variables** or **Secrets** tab, add `VITE_POCKETBASE_URL` with the target PocketBase URL.
- The build job will automatically extract this value and fail explicitly if it is not configured.

## Commands

- Development: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## Local Pocketbase

```bash

docker compose up

# load example data
# without running this command, pocket base is initialized with empty collections
docker compose run apply_example_data

### play with pocketbase

docker compose down

```

Migration scripts (`./data/migrations`) describe the PocketBase database schema, including collection definitions.

The example directory (`./data/example`) contains JSON exports of production collections, with one file per collection.

For uploaded assets, copy the files into the data directory under a dedicated subdirectory named after the related collection.

