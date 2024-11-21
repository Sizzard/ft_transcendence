all :
	./adress_script.sh
	docker-compose up --build

nocache :
	docker-compose build --no-cache
	docker-compose up

fclean :
	docker image prune -af

re : fclean nocache

git :
	git add .
	git commit -m ${USER}
	git push