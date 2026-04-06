FROM node:22-alpine AS builder

WORKDIR /app

ARG PUBLIC_GISCUS_REPO
ARG PUBLIC_GISCUS_REPO_ID
ARG PUBLIC_GISCUS_CATEGORY
ARG PUBLIC_GISCUS_CATEGORY_ID

ENV PUBLIC_GISCUS_REPO=$PUBLIC_GISCUS_REPO
ENV PUBLIC_GISCUS_REPO_ID=$PUBLIC_GISCUS_REPO_ID
ENV PUBLIC_GISCUS_CATEGORY=$PUBLIC_GISCUS_CATEGORY
ENV PUBLIC_GISCUS_CATEGORY_ID=$PUBLIC_GISCUS_CATEGORY_ID

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:1.29-alpine AS runner

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
