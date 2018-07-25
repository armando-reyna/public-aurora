#!/bin/sh

USERNAME="root"
HOSTNAME="62.151.181.207"

echo "Connectting to server..."
ssh -l ${USERNAME} ${HOSTNAME} 'bash -s' < qc.ci.ssh.sh