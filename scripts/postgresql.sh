#!/bin/bash
set -e

# --- 변수 설정 ---
DB_NAME="sdl"
DB_USER="admin"
DB_PASS="smc1234!"

echo "INFO: Updating system packages..."
apt-get update

echo "INFO: Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

echo "INFO: Creating PostgreSQL user and database..."
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

echo "INFO: Configuring PostgreSQL for external access..."
PG_CONF_FILE=$(sudo -u postgres psql -c 'SHOW config_file' | sed -n 3p | tr -d '[:space:]')
PG_HBA_FILE=$(sudo -u postgres psql -c 'SHOW hba_file' | sed -n 3p | tr -d '[:space:]')

sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF_FILE"
echo "host    all             all             0.0.0.0/0               md5" >> "$PG_HBA_FILE"

echo "INFO: Enabling and starting PostgreSQL service..."
systemctl enable postgresql
systemctl restart postgresql

echo "SUCCESS: PostgreSQL setup complete."