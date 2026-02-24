#!/usr/bin/env python3
"""
RootResume — Python Demo
Running live inside an Alpine Linux Docker container.
"""
import sys

W    = 32          # box outer width (═ chars)
RULE = "  " + "─" * W


def hdr(n, title):
    print()
    print(RULE)
    print(f"  [{n}/4]  {title}")
    print(RULE)


# ── HEADER ──────────────────────────────────
print()
print(RULE)
print("  ROOTRESUME - Python3 Demo")
print("  Alpine Linux | Python " + sys.version.split()[0])
print("  Net: isolated  |  RAM: 128 MB")
print(RULE)
print()
print("  Sections:")
print("    1. Bubble Sort    O(n^2)")
print("    2. Sieve of Eratosthenes")
print("    3. Sierpinski Triangle")
print("    4. Fibonacci Sequence")
print()


# ── 1. BUBBLE SORT ──────────────────────────
hdr(1, "BUBBLE SORT")
print()
print("  Swap adjacent elements until sorted.")
print("  Time: O(n²)  |  Space: O(1)")
print()
orig = [64, 34, 25, 12, 42, 11, 90, 47]
data = list(orig)
BW, MX = 16, max(orig)

def bar(v):
    f = round(v / MX * BW)
    return "█" * f + "░" * (BW - f)

print("  Before:")
for v in orig:
    print(f"  {bar(v)} {v:3}")

swaps, n = 0, len(data)
for i in range(n):
    for j in range(n - i - 1):
        if data[j] > data[j + 1]:
            data[j], data[j + 1] = data[j + 1], data[j]
            swaps += 1

print()
print("  After:")
for v in data:
    print(f"  {bar(v)} {v:3}")
print(f"\n  Sorted in {swaps} swaps.")


# ── 2. SIEVE OF ERATOSTHENES ─────────────────
hdr(2, "SIEVE OF ERATOSTHENES")
print()
print("  Cross off multiples of each prime.")
print("  Time: O(n log log n)")
print()
limit = 50
sieve = [True] * (limit + 1)
sieve[0] = sieve[1] = False
for i in range(2, int(limit ** 0.5) + 1):
    if sieve[i]:
        for j in range(i * i, limit + 1, i):
            sieve[j] = False
print("  ▓ = prime   ░ = composite")
print()
nums, COLS = list(range(2, limit + 1)), 6
for r in range(0, len(nums), COLS):
    chunk = nums[r:r + COLS]
    top = "  +" + "----+" * len(chunk)
    mid = "  |" + "".join(
        ("▓▓" if sieve[n] else "░░") + f"{n:2}" + "|"
        for n in chunk
    )
    print(top)
    print(mid)
print("  +" + "----+" * COLS)
primes = [n for n in range(2, limit + 1) if sieve[n]]
print(f"\n  {len(primes)} primes ≤ {limit}:")
for r in range(0, len(primes), 8):
    print("  " + "  ".join(f"{p:2}" for p in primes[r:r + 8]))


# ── 3. SIERPIŃSKI TRIANGLE ───────────────────
hdr(3, "SIERPIŃSKI TRIANGLE")
print()
print("  Pascal's Triangle mod 2.")
print("  Odd cells = 1 form a fractal.")
print()
rows = 16
triangle = [[1]]
for i in range(1, rows):
    prev = triangle[-1]
    row = [1] + [prev[j] + prev[j+1] for j in range(len(prev)-1)] + [1]
    triangle.append(row)
for i, row in enumerate(triangle):
    pad   = " " * (rows - i)
    cells = "".join("##" if v % 2 else "  " for v in row)
    print(f"  {pad}{cells}")


# ── 4. FIBONACCI ───────────────────────────
hdr(4, "FIBONACCI SEQUENCE")
print()
print("  Each term = sum of the two before.")
print("  Ratio converges to φ ≈ 1.618")
print()
fibs = [1, 1]
while fibs[-1] < 2000:
    fibs.append(fibs[-1] + fibs[-2])
fibs = fibs[:13]
MX, BW = fibs[-1], 18
for i, f in enumerate(fibs):
    b = round(f / MX * BW)
    print(f"  F({i+1:2})={f:5}  " + "▓" * b + "░" * (BW - b))
phi = fibs[-1] / fibs[-2]
print(f"\n  φ ≈ {phi:.6f}")


# ── FOOTER ───────────────────────────────
print()
print(RULE)
print("  Source: /home/demo/demo.py")
print("  Try: visualize life  |  challenge")
print(RULE)
print()
