IMAGE_TAG=latest

run:
	php -S localhost:8080 -t public -d display_errors=1 -d error_reporting=E_ALL

build:
	docker build -t emilsroka_zaw/backend:$(IMAGE_TAG) .