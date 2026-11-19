PKG = ../../../crates/vectors-core/pkg
WASM = pkg
BUILD = .build
V2 = dist/v2
V3 = dist/v3
ARTIFACTS = download
NAME = vectors
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
  CHROME := google-chrome
else
  CHROME := "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
endif

.PHONY: sync build-wasm build package zip xpi crx typecheck clean

# Copy the wasm-bindgen output into the extension package.
sync:
	mkdir -p $(WASM)
	cp $(PKG)/vectors.js $(PKG)/vectors_bg.wasm $(WASM)/

# Rebuild the wasm package, then sync it.
build-wasm:
	$(MAKE) -C ../../../crates/vectors-core build-wasm
	$(MAKE) sync

# Compile TypeScript and assemble dist/v2 (MV2) + dist/v3 (MV3).
build: sync typecheck
	pnpm exec rimraf $(BUILD) $(V2) $(V3)
	pnpm exec tsc -p tsconfig.json
	# The extension has no bundler: point the bare specifier at the copied wasm pkg.
	perl -pi -e "s|['\"]\@vectors/core['\"]|'./pkg/vectors.js'|g" $(BUILD)/*.js
	# --- MV3 ---
	mkdir -p $(V3)/pkg
	cp $(BUILD)/background.js $(BUILD)/offscreen.js $(BUILD)/convert.js $(BUILD)/util.js $(BUILD)/log.js $(V3)/
	cp public/offscreen.html $(V3)/
	cp public/manifest/v3/manifest.json $(V3)/manifest.json
	cp -R public/icons $(V3)/
	cp $(WASM)/vectors.js $(WASM)/vectors_bg.wasm $(V3)/pkg/
	# --- MV2 ---
	mkdir -p $(V2)/pkg
	cp $(BUILD)/background-mv2.js $(BUILD)/convert.js $(BUILD)/util.js $(BUILD)/log.js $(V2)/
	cp public/background-mv2.html $(V2)/
	cp public/manifest/v2/manifest.json $(V2)/manifest.json
	cp -R public/icons $(V2)/
	cp $(WASM)/vectors.js $(WASM)/vectors_bg.wasm $(V2)/pkg/

# Package both variants as .zip, .xpi and .crx into download/.
package: build zip xpi crx

zip:
	mkdir -p $(ARTIFACTS)
	rm -f $(ARTIFACTS)/$(NAME)-v2.zip $(ARTIFACTS)/$(NAME)-v3.zip
	cd $(V2) && zip -r $(CURDIR)/$(ARTIFACTS)/$(NAME)-v2.zip .
	cd $(V3) && zip -r $(CURDIR)/$(ARTIFACTS)/$(NAME)-v3.zip .

xpi:
	mkdir -p $(ARTIFACTS)
	pnpm exec web-ext build --source-dir $(V2) --artifacts-dir $(ARTIFACTS) --filename $(NAME)-v2.xpi --overwrite-dest
	pnpm exec web-ext build --source-dir $(V3) --artifacts-dir $(ARTIFACTS) --filename $(NAME)-v3.xpi --overwrite-dest

crx:
	@if command -v $(CHROME) >/dev/null 2>&1; then \
		mkdir -p $(ARTIFACTS); \
		$(CHROME) --pack-extension=$(CURDIR)/$(V2); \
		mv $(V2).crx $(ARTIFACTS)/$(NAME)-v2.crx; \
		$(CHROME) --pack-extension=$(CURDIR)/$(V3); \
		mv $(V3).crx $(ARTIFACTS)/$(NAME)-v3.crx; \
		rm -f $(V2).pem $(V3).pem; \
	else \
		echo "Warning: Chrome not found at $(CHROME). Skipping CRX packaging."; \
	fi

# Type-check only.
typecheck:
	pnpm exec tsc -p tsconfig.json --noEmit

clean:
	pnpm exec rimraf $(BUILD) $(V2) $(V3) $(WASM) $(ARTIFACTS)
