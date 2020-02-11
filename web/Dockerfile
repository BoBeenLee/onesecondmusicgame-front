FROM node:10.15.3

RUN apt-get update -y
RUN apt-get install python-dev python-pip curl -y
RUN apt-get install libnss3 chromium -y
RUN easy_install --upgrade six
RUN pip install awscli