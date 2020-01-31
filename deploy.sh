#!/bin/bash

ssh-keygen -f /root/.ssh/id_rsa -t rsa -N ''
cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys

apt-add-repository -y ppa:ansible/ansible
apt-add-repository -y ppa:git-core/ppa
apt-add-repository -y ppa:cassou/emacs
apt-get -y update
apt-get -y install ansible emacs24 emacs24-el emacs24-common-non-dfsg git make
mkdir -p /root/tmp/installation-scripts
make -k build
mkdir -p /root/tmp/installation-scripts
rsync -a build/code/runtime /root/tmp/installation-scripts/
rsync -a build/code/deployment /root/tmp/installation-scripts/
(cd build/code/deployment; ansible-playbook -i hosts site.yaml)


