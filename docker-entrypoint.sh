#!/bin/sh

# Docker entrypoint script for Angular Multi-Tenant App

set -e

# Function to replace environment variables in runtime config
replace_env_vars() {
    local file="$1"
    local temp_file=$(mktemp)
    
    # Replace environment variables in the template
    envsubst < "$file" > "$temp_file"
    mv "$temp_file" "$file"
}

# Replace environment variables in runtime config if template exists
if [ -f "/usr/share/nginx/html/assets/runtime-config.json.template" ]; then
    echo "Replacing environment variables in runtime config..."
    replace_env_vars "/usr/share/nginx/html/assets/runtime-config.json.template"
    mv "/usr/share/nginx/html/assets/runtime-config.json.template" "/usr/share/nginx/html/assets/runtime-config.json"
fi

# Start the main process
exec "$@"