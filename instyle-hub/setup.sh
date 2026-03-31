#!/bin/bash

# ============================================
# InStyle Hub - Complete Setup Script
# ============================================
# Run this script to set up the entire project

set -e  # Exit on error

echo "🚀 InStyle Hub - Complete Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT"

echo -e "${YELLOW}Project Root: $PROJECT_ROOT${NC}"
echo -e "${YELLOW}Backend Dir: $BACKEND_DIR${NC}"

# Step 1: Install backend dependencies
echo ""
echo -e "${GREEN}[1/6]${NC} Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install

# Step 2: Generate Prisma Client
echo ""
echo -e "${GREEN}[2/6]${NC} Generating Prisma Client..."
npm run prisma:generate

# Step 3: Run database migrations
echo ""
echo -e "${GREEN}[3/6]${NC} Running database migrations..."
npm run prisma:migrate -- --name init

# Step 4: Seed database
echo ""
echo -e "${GREEN}[4/6]${NC} Seeding database with sample data..."
npm run seed

# Step 5: Test backend
echo ""
echo -e "${GREEN}[5/6]${NC} Testing backend health check..."
cd "$BACKEND_DIR"
timeout 5 npm run dev &
SERVER_PID=$!
sleep 3
curl http://localhost:5000/api/health && echo -e "${GREEN}✓ Backend health check passed${NC}" || echo -e "${RED}✗ Backend health check failed${NC}"
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

# Step 6: Display startup instructions
echo ""
echo -e "${GREEN}[6/6]${NC} Setup complete!"
echo ""
echo -e "${GREEN}✓ Backend setup complete!${NC}"
echo ""
echo "======================================"
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Start the backend server:"
echo -e "   ${YELLOW}cd $BACKEND_DIR && npm run dev${NC}"
echo ""
echo "2. In a new terminal, start the frontend:"
echo -e "   ${YELLOW}cd $FRONTEND_DIR && python -m http.server 3000${NC}"
echo ""
echo "3. Open your browser:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
