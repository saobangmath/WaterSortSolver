#!/bin/bash

# Start development servers for Water Sort Solver

echo "🧪 Starting Water Sort Solver Development Environment..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Start backend
echo "🚀 Starting Django backend..."
cd backend/backend
source ../venv/bin/activate
pip install -r ../requirements.txt
python manage.py runserver 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd ../../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000/api/"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
