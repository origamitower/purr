BIN := ../../node_modules/.bin/
JEST := $(BIN)/jest
FOHM := $(BIN)/fohm

# -- TASKS ------------------------------------------------------------
.PHONY: help
help:
	@echo "Building:"
	@echo "---------"
	@echo "  build              Compiles the project"
	@echo "  build-tests        Compiles the tests"
	@echo "  build-grammars     Compiles the grammar files"
	@echo ""
	@echo "Testing:"
	@echo "--------"
	@echo "  test               Compiles and runs the tests"
	@echo "  test-watch-build   Continuously compiles the tests"
	@echo "  test-watch-run     Continuously runs the tests"
	@echo ""
	@echo "Cleaning up:"
	@echo "------------"
	@echo "  distclean          Cleans up built artifacts"
	@echo "  clean              Cleans up the source folders"


.PHONY: build
build: build-grammars
	cd src && dotnet fable fable-splitter -- --config src/splitter.config.js

.PHONY: build-tests
build-tests: build-grammars
	cd test && dotnet fable fable-splitter -- --config test/splitter.config.js
	cp -R test/fixtures build/test

.PHONY: build-grammars
build-grammars:
	$(FOHM) compile language/Origami.ohm --outDir src/Generated --name OrigamiGrammar

.PHONY: test
test: build-tests
	$(JEST)

.PHONY: test-watch-build
test-watch-build: build-grammars
	cd test && dotnet fable fable-splitter -- --config test/splitter.config.js --watch

.PHONY: test-watch-run
test-watch-run:
	$(JEST) --watch

.PHONY: distclean
distclean:
	rm -rf build