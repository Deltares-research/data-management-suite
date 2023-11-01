deploy-test:
	docker context use dms-test
	docker-compose -f ./deployment/docker-compose.test.yml up --build -d
	docker context use default

logs-test:
	-docker-compose --context dms-test -f ./deployment/docker-compose.test.yml logs --follow --tail 200

deploy-prod:
	docker context use dms-prod
	docker-compose -f ./deployment/docker-compose.prod.yml up --build -d
	docker context use default

logs-prod:
	-docker-compose --context dms-prod -f ./deployment/docker-compose.prod.yml logs --follow --tail 200
