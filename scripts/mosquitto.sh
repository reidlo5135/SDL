#!/bin/bash
set -e

echo "INFO: Updating system packages..."
apt-get update

echo "INFO: Installing Mosquitto..."
apt-get install -y mosquitto mosquitto-clients

echo "INFO: Configuring Mosquitto for anonymous access..."
MOSQUITTO_CONF_FILE="/etc/mosquitto/conf.d/default.conf"
cat <<EOT > "$MOSQUITTO_CONF_FILE"
listener 1883
allow_anonymous true
EOT

echo "INFO: Enabling and starting Mosquitto service..."
systemctl enable mosquitto
systemctl restart mosquitto

echo "SUCCESS: Mosquitto setup complete."