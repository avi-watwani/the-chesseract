#!/bin/bash

echo "Installing The Chesseract dependencies..."

# Create necessary directories
mkdir -p public/images
mkdir -p public/fonts
mkdir -p types

# Install dependencies
npm install \
  next@14.1.0 \
  react@18.2.0 \
  react-dom@18.2.0 \
  lucide-react@0.320.0 \
  class-variance-authority@0.7.0 \
  clsx@2.1.0 \
  tailwind-merge@2.2.1 \
  tailwindcss-animate@1.0.7

# Install dev dependencies
npm install --save-dev \
  @types/node@20.11.5 \
  @types/react@18.2.48 \
  @types/react-dom@18.2.18 \
  autoprefixer@10.4.17 \
  eslint@8.56.0 \
  eslint-config-next@14.1.0 \
  postcss@8.4.33 \
  tailwindcss@3.4.1 \
  typescript@5.3.3

# Create necessary font directories
mkdir -p public/fonts

# Download Montserrat font
echo "Downloading Montserrat font..."
curl -L https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-VariableFont_wght.ttf -o public/fonts/Montserrat-VariableFont_wght.ttf

# Download Open Sans font
echo "Downloading Open Sans font..."
curl -L https://github.com/google/fonts/raw/main/ofl/opensans/OpenSans-VariableFont_wdth,wght.ttf -o public/fonts/OpenSans-VariableFont_wdth,wght.ttf

echo "Installation complete! Run 'npm run dev' to start the development server." 