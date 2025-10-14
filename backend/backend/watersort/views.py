from collections.abc import Iterable
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import status 
from rest_framework.decorators import api_view
from .solver import GameState, Bottle
import json, time
from threading import Thread

# Create your views here.

def index(request, index_id): 
    return HttpResponse(f"water sort landing page {index_id}")

@csrf_exempt
@require_http_methods(["POST"])
def solve_puzzle(request: HttpRequest): 
    try:
        data = json.loads(request.body)
        game = GameState()
        bottles = data.get("bottles", [])
        
        if not isinstance(bottles, list):
            return JsonResponse({"error": "Invalid data format"}, status=400)

        for bottle in bottles: 
            try:
                capacity = int(bottle["capacity"])
                waters = list(bottle["waters"])
                game.add_bottle(Bottle(capacity=capacity, waters=waters))
            except (KeyError, ValueError, TypeError) as e:
                return JsonResponse({"error": f"Invalid bottle data: {str(e)}"}, status=400)
        
        # Solve the puzzle
        thread = Thread(target=game.solve)
        thread.start()
        thread.join(timeout=30)  # Increased timeout to 30 seconds
        
        if thread.is_alive(): 
            return JsonResponse({"error": "Puzzle solving timeout (30 seconds)"}, status=408)
        
        if game.plan is None:
            return JsonResponse({"error": "No solution found"}, status=404)
        
        return JsonResponse({
            "plan": game.plan,
            "steps": len(game.plan),
            "success": True
        }, status=200)
        
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

@api_view(['POST'])
def generate_solver_plan(request: HttpRequest): 
    data = json.loads(request.body)
    game : GameState = GameState()
    bottles = data["bottles"]
    if not isinstance(bottles, list):
        return JsonResponse({"err": "invalid data"}, status = 404)

    for bottle in bottles: 
        try:
            capacity = int(bottle["capacity"])
            waters = list[str](bottle["waters"])
            game.add_bottle(Bottle(capacity = capacity, waters = waters))
        except: 
            return JsonResponse({"err": "invalid body request"}, status = 404)
    
    
    thread  = Thread(target=game.solve)
    thread.start()
    thread.join(timeout=10)
    if thread.is_alive(): 
        return JsonResponse({"err": "too much time taken for generating the plan (timeout = 10 seconds)"}, status = 500)
    
    return JsonResponse({"plan": game.plan}, status = 200)
