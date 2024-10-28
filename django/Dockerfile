FROM python:latest

WORKDIR /app

COPY ./django/requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY ./django/pong_api/ /app/

RUN python3 -m pip install -r requirements.txt

EXPOSE 8000

CMD ["daphne","-p", "8000","-b", "0.0.0.0", "pong_api.asgi:application"]