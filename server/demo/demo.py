# RootResume — Demo interactivo
import time, math

print("\n=== Bubble Sort — visualizacion paso a paso ===")
data = [64, 34, 25, 12, 22, 11, 90]
print(f"  Input:  {data}")
n = len(data)
for i in range(n):
    for j in range(n - i - 1):
        if data[j] > data[j+1]:
            data[j], data[j+1] = data[j+1], data[j]
    print(f"  Pass {i+1}: {data}")
    time.sleep(0.15)

print(f"\n  Output: {data} OK")

print("\n=== Numeros primos hasta 50 ===")
primes = [x for x in range(2, 51) if all(x % i != 0 for i in range(2, int(math.sqrt(x)) + 1))]
print(" ".join(map(str, primes)))

print("\nTip: proba  visualize bubble  o  challenge")
