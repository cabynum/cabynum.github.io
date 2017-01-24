FROM jekyll/jekyll:pages

MAINTAINER Chris Bynum <cbynum@gmail.com>

COPY Gemfile* /srv/jekyll/

WORKDIR /srv/jekyll

RUN echo "ipv6" >> /etc/modules
RUN echo "@community http://dl-2.alpinelinux.org/alpine/edge/community" > /etc/apk/repositories; \
		echo "@testing http://dl-2.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories; \
		echo "http://dl-2.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories; \
    echo "http://dl-3.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories; \
		echo "http://dl-3.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories; \
		echo "http://dl-3.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories; \
    echo "http://dl-4.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories; \
		echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories; \
		echo "http://dl-4.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories; \
		echo "http://dl-5.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories; \
		echo "http://dl-5.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories; \
    echo "http://dl-5.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories

RUN apk update
RUN	apk add ruby-dev --force
RUN	apk add gcc --force
RUN	apk add make --force
RUN	apk add curl --force
RUN	apk add build-base --force
RUN	apk add libc-dev --force
RUN	apk add libffi-dev --force
RUN	apk add zlib-dev --force
RUN	apk add libxml2-dev --force
RUN	apk add libgcrypt-dev --force
RUN	apk add libxslt-dev --force
RUN	apk add python --force

RUN bundle config build.nokogiri --use-system-libraries && \
	bundle install

EXPOSE 4000
