from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from rest_framework import status 
from rest_framework.decorators import api_view

# Create your views here.

def index(request, index_id): 
    return HttpResponse(f"water sort landing page {index_id}")

@api_view(['POST'])
def generate_solver_plan(request: HttpRequest): 
    return HttpResponse("Success", status = 200)