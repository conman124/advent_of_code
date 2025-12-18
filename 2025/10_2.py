import sys, os
from ortools.linear_solver import pywraplp

file_path = os.path.abspath(__file__)
sys.path.append(os.path.dirname(file_path) + "/../input/2025")
aocinput = __import__("10").aocinput

final = 0

for line in aocinput.split("\n"):
    lights,*buttons_str,joltage_str = line.split(" ")
    buttons = [[int(x) for x in button[1:-1].split(",")] for button in buttons_str]
    joltage = [int(x) for x in joltage_str[1:-1].split(",")]

    goal = joltage
    vecs = [
        [0] * len(joltage) for x in buttons
    ]

    for i, button in enumerate(buttons):
        for j, offset in enumerate(button):
            vecs[i][button[j]] = 1

    solver = pywraplp.Solver.CreateSolver("SCIP")

    variables = []
    for i in range(0, len(vecs)):
        variables.append(solver.IntVar(0, solver.Infinity(), "a[%i]" % i))

    for i in range(0, len(goal)):
        products = []
        for j in range(0, len(variables)):
            products.append(variables[j] * vecs[j][i])
        solver.Add(sum(products) == goal[i])

    solver.Minimize(sum(variables))
    status = solver.Solve()
    if status == pywraplp.Solver.OPTIMAL:
        final += solver.Objective().Value()
    else:
        raise "The problem does not have an optimal solution."

print(int(final))
