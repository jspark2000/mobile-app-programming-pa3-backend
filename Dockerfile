# [NOTE] Build image from the root directory of this repository.
# ex) `docker build -f Dockerfile .`

### BUILDER ###
FROM node:20.13.1-alpine AS builder

COPY . /build
WORKDIR /build

RUN npm run build

### PRODUCTION ###
FROM node:20.13.1-alpine

ENV NODE_ENV=production

COPY --from=builder /build /app
COPY ./entrypoint.sh /app
WORKDIR /app

ENTRYPOINT ["/app/entrypoint.sh"]
