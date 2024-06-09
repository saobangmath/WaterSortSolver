from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from rest_framework import status 
from rest_framework.decorators import api_view
from .solver import GameState, Bottle
import json

# Create your views here.

def index(request, index_id): 
    return HttpResponse(f"water sort landing page {index_id}")

@api_view(['POST'])
def generate_solver_plan(request: HttpRequest): 
    data = json.loads(request.body)
    game : GameState = GameState()
    bottles = data["bottles"]
    if not isinstance(bottles, list):
        return HttpResponse("invalid data", status = 404)

    for bottle in bottles: 
        game.add_bottle(Bottle(capacity = bottle["capacity"], waters = bottle["waters"]))

    plan  = game.solve()
    return HttpResponse(plan, status = 200)
