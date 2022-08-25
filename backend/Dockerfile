FROM python:3.8

USER root

# Install CMake for gqlalchemy
RUN apt-get update && \
  apt-get --yes install cmake && \
  rm -rf /var/lib/apt/lists/*
WORKDIR /backend
COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt
COPY main.py ./
CMD [ "python", "main.py"]