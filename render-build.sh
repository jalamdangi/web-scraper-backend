#!/usr/bin/env bash

set -e  # Exit on any error
set -o pipefail  # Catch errors in piped commands

# Update package lists
echo "Updating package lists..."
apt-get update -y

# Install dependencies for downloading and installing Chrome
echo "Installing necessary tools..."
apt-get install -y wget unzip apt-transport-https

# Download Google Chrome
echo "Downloading Google Chrome..."
wget -O google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# Verify the file was downloaded successfully
if [ ! -f "google-chrome-stable_current_amd64.deb" ]; then
  echo "Google Chrome download failed. Exiting."
  exit 1
fi

# Install Google Chrome
echo "Installing Google Chrome..."
apt-get install -y ./google-chrome-stable_current_amd64.deb

# Clean up after installation
echo "Cleaning up..."
rm -f google-chrome-stable_current_amd64.deb

# Install Puppeteer dependencies
echo "Installing Puppeteer dependencies..."
apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils

echo "Installation complete."
