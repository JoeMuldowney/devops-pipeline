FROM python:3.12.1

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=userauth.settings

WORKDIR /storeapp

RUN pip install --upgrade pip

COPY requirements.txt /storeapp/

RUN pip install -r requirements.txt

COPY . .

RUN pip install python-dotenv

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]