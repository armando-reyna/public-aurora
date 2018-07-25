#!/bin/sh

USERNAME="root"
HOSTNAME="70.35.205.189"

echo "Connectting to server..."
ssh -l ${USERNAME} ${HOSTNAME} 'bash -s' < prod.ci.ssh.sh