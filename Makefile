all :
	make -C docker_srcs

nocache :
	make nocache -C docker_srcs

fclean :
	make fclean -C docker_srcs

re : fclean nocache

git :
	make git -C docker_srcs