FROM ubuntu:16.04

# Usage: File Author/Maintainer
MAINTAINER vlead-systems "systems@vlabs.ac.in"

#Usage: Setting proxy environment
#ENV http_proxy "http://proxy.iiit.ac.in:8080"
#ENV https_proxy "http://proxy.iiit.ac.in:8080"

# Usage: Updating system
RUN apt-get update

# Pre-build


# Usage: Installing dependencies for outreach-portal
RUN apt-get install -y make rsync apache2 wget
RUN rsync -avz apache2.conf /etc/apache2/
RUN rsync -avz security.conf /etc/apache2/conf-available/security.conf
RUN apt-get install libapache2-modsecurity -y
RUN a2enmod headers
RUN a2enmod rewrite
RUN service apache2 restart
RUN bash /var/www/setup.sh
RUN python /var/www/setup.py install
RUN bash /var/www/configure.sh
RUN python /var/www/db_setup.py


RUN mkdir /outreach-portal

COPY src/ /outreach-portal/src

WORKDIR ./outreach-portal/src

#Usage: Running make
RUN make



# Post-build
RUN cp -R ../build/code/* /var/www/
RUN chmod -R 755 /var/www
RUN mkdir /var/www/logs
RUN chmod -R 777 /var/www/logs
RUN mkdir /var/www/src/static/uploads
RUN chmod -R 777 /var/www/src/static/uploads


EXPOSE 80
EXPOSE 443

#Usage: Setting permissions in /var/www
RUN chmod -R 755 /var/www/*

CMD /usr/sbin/apache2ctl -D FOREGROUND