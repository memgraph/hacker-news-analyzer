FROM python:3.9.4-slim

WORKDIR /backend

COPY requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt
 
COPY . .

EXPOSE 8000
