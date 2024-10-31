all :
	docker-compose up --build

git :
	git add .
	git commit -m ${USER}
	git push