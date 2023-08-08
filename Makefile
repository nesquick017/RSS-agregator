install:
	npm ci
start:
	npm start
build-dev:
	npm build-dev
build-prod:
	npm build-prod
publish:
	npm publish --dry-run
lint:
	npx eslint ./src
