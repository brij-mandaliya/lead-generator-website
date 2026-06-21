#!/bin/sh
set -e

pnpm --filter @workspace/db run migrate 2>&1

node --enable-source-maps ./dist/index.mjs
