#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  Project Detector
#  Detects tech stack and recommends relevant skills
# ============================================================================

PROJECT_DIR="${1:-.}"
OUTPUT_FORMAT="${2:-human}"  # human | json

# Detection results
LANGUAGE=""
FRAMEWORK=""
TEST_RUNNER=""
ORM=""
CSS=""
PACKAGE_MANAGER=""
HAS_DOCKER=false
HAS_CI=false
HAS_K8S=false
HAS_TERRAFORM=false
DETECTED=()

detect() {
    local name=$1
    DETECTED+=("$name")
}

# ── Language Detection ──────────────────────────────────────────────────
if [ -f "$PROJECT_DIR/package.json" ]; then
    detect "nodejs"
    LANGUAGE="javascript"
    if [ -f "$PROJECT_DIR/tsconfig.json" ]; then
        detect "typescript"
        LANGUAGE="typescript"
    fi
fi

if [ -f "$PROJECT_DIR/requirements.txt" ] || [ -f "$PROJECT_DIR/pyproject.toml" ] || [ -f "$PROJECT_DIR/setup.py" ] || [ -f "$PROJECT_DIR/Pipfile" ]; then
    detect "python"
    LANGUAGE="${LANGUAGE:-python}"
fi

if [ -f "$PROJECT_DIR/go.mod" ]; then
    detect "go"
    LANGUAGE="${LANGUAGE:-go}"
fi

if [ -f "$PROJECT_DIR/Cargo.toml" ]; then
    detect "rust"
    LANGUAGE="${LANGUAGE:-rust}"
fi

if [ -f "$PROJECT_DIR/Gemfile" ]; then
    detect "ruby"
    LANGUAGE="${LANGUAGE:-ruby}"
fi

# ── Framework Detection ────────────────────────────────────────────────
if [ -f "$PROJECT_DIR/package.json" ]; then
    pkg=$(cat "$PROJECT_DIR/package.json" 2>/dev/null || echo "{}")

    # React ecosystem
    if echo "$pkg" | grep -q '"react"'; then
        detect "react"
        FRAMEWORK="react"
    fi
    if echo "$pkg" | grep -q '"next"'; then
        detect "nextjs"
        FRAMEWORK="nextjs"
    fi
    if echo "$pkg" | grep -q '"vue"'; then
        detect "vue"
        FRAMEWORK="vue"
    fi
    if echo "$pkg" | grep -q '"nuxt"'; then
        detect "nuxt"
        FRAMEWORK="nuxt"
    fi
    if echo "$pkg" | grep -q '"svelte"\|"@sveltejs"'; then
        detect "svelte"
        FRAMEWORK="svelte"
    fi
    if echo "$pkg" | grep -q '"express"'; then
        detect "express"
        FRAMEWORK="${FRAMEWORK:-express}"
    fi
    if echo "$pkg" | grep -q '"fastify"'; then
        detect "fastify"
        FRAMEWORK="${FRAMEWORK:-fastify}"
    fi
    if echo "$pkg" | grep -q '"hono"'; then
        detect "hono"
        FRAMEWORK="${FRAMEWORK:-hono}"
    fi

    # Test runners
    if echo "$pkg" | grep -q '"jest"'; then
        detect "jest"
        TEST_RUNNER="jest"
    fi
    if echo "$pkg" | grep -q '"vitest"'; then
        detect "vitest"
        TEST_RUNNER="vitest"
    fi
    if echo "$pkg" | grep -q '"playwright"'; then
        detect "playwright"
    fi
    if echo "$pkg" | grep -q '"cypress"'; then
        detect "cypress"
    fi

    # ORMs
    if echo "$pkg" | grep -q '"prisma"\|"@prisma"'; then
        detect "prisma"
        ORM="prisma"
    fi
    if echo "$pkg" | grep -q '"typeorm"'; then
        detect "typeorm"
        ORM="typeorm"
    fi
    if echo "$pkg" | grep -q '"drizzle-orm"'; then
        detect "drizzle"
        ORM="drizzle"
    fi
    if echo "$pkg" | grep -q '"sequelize"'; then
        detect "sequelize"
        ORM="sequelize"
    fi
    if echo "$pkg" | grep -q '"mongoose"'; then
        detect "mongoose"
        ORM="mongoose"
    fi

    # CSS
    if echo "$pkg" | grep -q '"tailwindcss"'; then
        detect "tailwind"
        CSS="tailwind"
    fi
    if echo "$pkg" | grep -q '"styled-components"'; then
        detect "styled-components"
        CSS="styled-components"
    fi

    # Package manager
    if [ -f "$PROJECT_DIR/pnpm-lock.yaml" ]; then
        PACKAGE_MANAGER="pnpm"
    elif [ -f "$PROJECT_DIR/yarn.lock" ]; then
        PACKAGE_MANAGER="yarn"
    elif [ -f "$PROJECT_DIR/bun.lockb" ]; then
        PACKAGE_MANAGER="bun"
    else
        PACKAGE_MANAGER="npm"
    fi
fi

# Python frameworks
if [ -f "$PROJECT_DIR/requirements.txt" ] || [ -f "$PROJECT_DIR/pyproject.toml" ]; then
    reqs=""
    [ -f "$PROJECT_DIR/requirements.txt" ] && reqs=$(cat "$PROJECT_DIR/requirements.txt")
    [ -f "$PROJECT_DIR/pyproject.toml" ] && reqs="$reqs $(cat "$PROJECT_DIR/pyproject.toml")"

    if echo "$reqs" | grep -qi "django"; then detect "django"; FRAMEWORK="${FRAMEWORK:-django}"; fi
    if echo "$reqs" | grep -qi "fastapi"; then detect "fastapi"; FRAMEWORK="${FRAMEWORK:-fastapi}"; fi
    if echo "$reqs" | grep -qi "flask"; then detect "flask"; FRAMEWORK="${FRAMEWORK:-flask}"; fi
    if echo "$reqs" | grep -qi "sqlalchemy"; then detect "sqlalchemy"; ORM="${ORM:-sqlalchemy}"; fi
    if echo "$reqs" | grep -qi "pytest"; then detect "pytest"; TEST_RUNNER="${TEST_RUNNER:-pytest}"; fi
fi

# ── Infrastructure Detection ──────────────────────────────────────────
[ -f "$PROJECT_DIR/Dockerfile" ] || [ -f "$PROJECT_DIR/docker-compose.yml" ] && HAS_DOCKER=true && detect "docker"
[ -d "$PROJECT_DIR/.github/workflows" ] && HAS_CI=true && detect "github-actions"
[ -d "$PROJECT_DIR/.gitlab-ci.yml" ] && HAS_CI=true && detect "gitlab-ci"
ls "$PROJECT_DIR"/*.tf >/dev/null 2>&1 && HAS_TERRAFORM=true && detect "terraform"
ls "$PROJECT_DIR"/k8s/ >/dev/null 2>&1 && HAS_K8S=true && detect "kubernetes"
[ -f "$PROJECT_DIR/nginx.conf" ] && detect "nginx"

# ── Output ─────────────────────────────────────────────────────────────
if [ "$OUTPUT_FORMAT" = "json" ]; then
    detected_json=$(printf '"%s",' "${DETECTED[@]}" | sed 's/,$//')
    cat <<EOF
{
  "language": "$LANGUAGE",
  "framework": "$FRAMEWORK",
  "test_runner": "$TEST_RUNNER",
  "orm": "$ORM",
  "css": "$CSS",
  "package_manager": "$PACKAGE_MANAGER",
  "has_docker": $HAS_DOCKER,
  "has_ci": $HAS_CI,
  "has_k8s": $HAS_K8S,
  "has_terraform": $HAS_TERRAFORM,
  "detected": [$detected_json]
}
EOF
else
    echo ""
    echo "  Project Analysis: $PROJECT_DIR"
    echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    [ -n "$LANGUAGE" ]        && echo "  Language:         $LANGUAGE"
    [ -n "$FRAMEWORK" ]       && echo "  Framework:        $FRAMEWORK"
    [ -n "$TEST_RUNNER" ]     && echo "  Test Runner:      $TEST_RUNNER"
    [ -n "$ORM" ]             && echo "  ORM:              $ORM"
    [ -n "$CSS" ]             && echo "  CSS:              $CSS"
    [ -n "$PACKAGE_MANAGER" ] && echo "  Package Manager:  $PACKAGE_MANAGER"
    [ "$HAS_DOCKER" = true ]  && echo "  Docker:           yes"
    [ "$HAS_CI" = true ]      && echo "  CI/CD:            yes"
    [ "$HAS_K8S" = true ]     && echo "  Kubernetes:       yes"
    [ "$HAS_TERRAFORM" = true ] && echo "  Terraform:        yes"
    echo ""
    echo "  Detected: ${DETECTED[*]}"
    echo ""
fi
