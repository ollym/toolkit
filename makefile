test:
	expresso -w -g -I lib test/*

build:
  node ./support/build.js

.PHONY: test