#!/bin/bash
set -e

echo "INFO: Updating system packages..."
apt-get update

echo "INFO: Installing Redis..."
apt-get install -y redis-server

echo "INFO: Configuring Redis for external access..."
REDIS_CONF_FILE="/etc/redis/redis.conf"
sed -i 's/^bind 127.0.0.1 ::1/bind 0.0.0.0/' "$REDIS_CONF_FILE"

echo "INFO: Enabling and starting Redis service..."
systemctl enable redis-server
systemctl restart redis-server

echo "SUCCESS: Redis setup complete."