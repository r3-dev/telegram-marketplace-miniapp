FROM node:20-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build-frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run ci:prod
RUN pnpm run -r build

FROM base AS frontend
COPY --from=build-frontend /app/apps/frontend/dist /app/apps/frontend/dist
