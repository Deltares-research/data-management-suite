# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl curl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

COPY prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

FROM python:3.9-slim-buster as python-docs-builder


WORKDIR /src/deltares_datasuite

ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_VIRTUALENVS_IN_PROJECT=false \
    POETRY_NO_INTERACTION=1 \
    POETRY_VERSION=1.6.1
ENV PATH="$PATH:$POETRY_HOME/bin"
RUN pip install "poetry==$POETRY_VERSION"
COPY /utils/deltares_datasuite/poetry.lock /src/deltares_datasuite
COPY /utils/deltares_datasuite/pyproject.toml /src/deltares_datasuite
RUN poetry install

COPY /utils/deltares_datasuite /src/deltares_datasuite
RUN mkdocs build

# Build the dev image with dev dependencies
FROM base as dev

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=python-docs-builder /src/deltares_datasuite/site /app/public/docs
COPY . .

CMD ["npx", "remix", "dev"]

# Finally, build the production image with minimal footprint
FROM base as prod

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=python-docs-builder /src/deltares_datasuite/site /app/public/docs
COPY . .

CMD ["npm", "start"]