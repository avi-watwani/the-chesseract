#!/bin/bash

# Script to update CORS origins in index.ts for production

echo "==================================="
echo "Update CORS Origins for Production"
echo "==================================="
echo ""

echo "Enter your production domain/IP (e.g., example.com or 123.456.789.0):"
read DOMAIN

echo ""
echo "Enter your Vercel/Next.js app URL (e.g., your-app.vercel.app) or press Enter to skip:"
read VERCEL_URL

echo ""
echo "The following origins will be added:"
echo "  - http://$DOMAIN"
echo "  - https://$DOMAIN"
if [ ! -z "$VERCEL_URL" ]; then
  echo "  - https://$VERCEL_URL"
fi

echo ""
echo "Current CORS configuration in index.ts:"
grep -A 6 "cors:" index.ts

echo ""
echo "Do you want to update index.ts? (y/n)"
read CONFIRM

if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
  # Create backup
  cp index.ts index.ts.backup
  echo "Backup created: index.ts.backup"
  
  echo ""
  echo "Please manually update the CORS origins in index.ts:"
  echo ""
  echo "origin: ["
  echo "  \"http://localhost:3000\","
  echo "  \"http://localhost:3001\","
  echo "  \"http://$DOMAIN\","
  echo "  \"https://$DOMAIN\","
  if [ ! -z "$VERCEL_URL" ]; then
    echo "  \"https://$VERCEL_URL\""
  fi
  echo "],"
  echo ""
  echo "Opening index.ts in nano editor..."
  sleep 2
  nano index.ts
  
  echo ""
  echo "✅ Done! Don't forget to restart the server:"
  echo "   sudo systemctl restart chesseract-websocket"
else
  echo "Update cancelled."
fi
