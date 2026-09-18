.PHONY: build-AiWorkerFunction

build-AiWorkerFunction:
	@echo "Resolving monorepo root from $(ARTIFACTS_DIR)..."
	$(eval REPO_ROOT := $(shell cd "$(ARTIFACTS_DIR)/../../../../.." && pwd))
	@echo "Monorepo root: $(REPO_ROOT)"
	# 1. Build workspace database package
	pnpm --dir "$(REPO_ROOT)" --filter @rewire/database build
	# 2. Build NestJS API
	pnpm --dir "$(REPO_ROOT)" --filter @rewire/api build
	# 3. Package Lambda bundle into SAM ARTIFACTS_DIR
	ARTIFACTS_DIR="$(ARTIFACTS_DIR)" node "$(REPO_ROOT)/apps/api/scripts/build-lambda.mjs"
