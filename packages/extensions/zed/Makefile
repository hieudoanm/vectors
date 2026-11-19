TARGET := wasm32-wasip2
OUT := download

.PHONY: build package clean format lint typecheck

build:
	cargo build --release --locked --target $(TARGET)

package: build
	mkdir -p $(OUT)
	tar -czf $(OUT)/extension-zed-vectors.tar.gz \
		extension.toml Cargo.toml Cargo.lock src

clean:
	rm -rf target $(OUT)

format:
	cargo fmt

lint:
	cargo clippy --locked --target $(TARGET) -- -D warnings
