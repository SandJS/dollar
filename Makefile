SRC = classes/*.js

TESTS = test/index

test:
	@NODE_ENV=test SAND_LOG=* ./node_modules/.bin/mocha \
		--require should \
		--harmony \
		$(TESTS) \
		--bail

.PHONY: test