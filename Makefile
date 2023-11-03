deploy-test:
	docker-compose --context dms-test -f ./deployment/docker-compose.test.yml up --build -d

shell-test:
	-docker-compose --context dms-test -f ./deployment/docker-compose.test.yml exec -it web bash

logs-test:
	-docker-compose --context dms-test -f ./deployment/docker-compose.test.yml logs --follow --tail 200

deploy-prod:
	docker-compose --context dms-prod -f ./deployment/docker-compose.prod.yml up --build -d

shell-prod:
	-docker-compose --context dms-prod -f ./deployment/docker-compose.prod.yml exec -it web bash

logs-prod:
	-docker-compose --context dms-prod -f ./deployment/docker-compose.prod.yml logs --follow --tail 200