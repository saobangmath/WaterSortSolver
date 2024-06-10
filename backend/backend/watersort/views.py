from collections.abc import Iterable
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from rest_framework import status 
from rest_framework.decorators import api_view
from .solver import GameState, Bottle
import json, time
from threading import Thread

# Create your views here.

def index(request, index_id): 
    return HttpResponse(f"water sort landing page {index_id}")

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
