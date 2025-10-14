from django.urls import path
from . import views 

urlpatterns = [
    path("<int:index_id>/", views.index, name = "index"), 
    path("generate_solver_plan/", views.generate_solver_plan, name = "plan"),
    path("solve/", views.solve_puzzle, name = "solve")
]