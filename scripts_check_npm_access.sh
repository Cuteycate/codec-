#!/usr/bin/env bash
set -euo pipefail

echo "Node: $(node -v)"
echo "npm:  $(npm -v)"
echo "registry: $(npm config get registry)"
echo "http_proxy: ${http_proxy:-<unset>}"
echo "https_proxy: ${https_proxy:-<unset>}"

echo
set +e
npm ping --registry="$(npm config get registry)"
code=$?
set -e

if [ $code -ne 0 ]; then
  cat <<MSG

❌ npm registry access failed.
Common fixes:
1) Configure your company's internal npm registry:
   npm config set registry <INTERNAL_REGISTRY_URL>
2) If your registry requires auth:
   npm login --registry <INTERNAL_REGISTRY_URL>
3) If a proxy requires credentials, set them in npm config:
   npm config set proxy http://<user>:<pass>@<host>:<port>
   npm config set https-proxy http://<user>:<pass>@<host>:<port>
MSG
  exit $code
fi

echo "✅ npm registry reachable"
