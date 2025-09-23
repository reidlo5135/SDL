#!/bin/bash
set -e

echo "INFO: Configuring firewall (UFW)..."
ufw allow ssh         # SSH 접속 허용 (필수)
ufw allow 5432/tcp    # PostgreSQL
ufw allow 6379/tcp    # Redis
ufw allow 1883/tcp    # Mosquitto MQTT

echo "WARNING: Enabling firewall. This may disrupt existing connections."
ufw --force enable
ufw reload

echo "SUCCESS: Firewall setup complete."