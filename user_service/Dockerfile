FROM public.ecr.aws/lambda/nodejs:20 AS builder
WORKDIR ${LAMBDA_TASK_ROOT}


RUN npm install -g pnpm


COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma/


RUN pnpm install


COPY . .


RUN pnpm exec prisma generate

RUN pnpm exec esbuild src/lambda.ts \
  --bundle \
  --platform=node \
  --target=node20 \
  --format=esm \
  --minify \
  --outfile=dist/index.js \
  --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);"

FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder ${LAMBDA_TASK_ROOT}/dist ./dist
COPY --from=builder ${LAMBDA_TASK_ROOT}/node_modules ./node_modules
COPY --from=builder ${LAMBDA_TASK_ROOT}/package.json ./package.json
COPY --from=builder ${LAMBDA_TASK_ROOT}/prisma ./prisma


CMD [ "dist/lambda.handler" ]
