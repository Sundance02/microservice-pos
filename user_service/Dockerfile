# Lambda rejects BuildKit provenance/SBOM (image index + attestation media types). Build and push with attestations off, e.g.:
#   PowerShell: $env:BUILDX_NO_DEFAULT_ATTESTATIONS="1"; docker buildx build --provenance=false --sbom=false --platform linux/amd64 -t <ecr>:<tag> .
#   bash: BUILDX_NO_DEFAULT_ATTESTATIONS=1 docker buildx build --provenance=false --sbom=false --platform linux/amd64 -t <ecr>:<tag> .
FROM public.ecr.aws/lambda/nodejs:20 AS builder
WORKDIR ${LAMBDA_TASK_ROOT}

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma/

COPY . .
RUN pnpm install --frozen-lockfile

RUN pnpm exec prisma generate

RUN pnpm exec esbuild src/lambda.ts \
  --bundle \
  --platform=node \
  --target=node20 \
  --format=esm \
  --minify \
  --outfile=dist/index.js \
  --banner:js="import { createRequire } from 'module'; import { fileURLToPath } from 'url'; import { dirname } from 'path'; const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);"

FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}
ENV NODE_ENV=production

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder ${LAMBDA_TASK_ROOT}/dist ./dist
COPY --from=builder ${LAMBDA_TASK_ROOT}/prisma ./prisma

CMD [ "dist/index.handler" ]
