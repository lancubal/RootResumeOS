FROM python:3.10-alpine

# Install build dependencies for C and Rust
RUN apk add --no-cache \
    gcc \
    musl-dev \
    rust \
    cargo \
    ncurses \
    bash

# Pre-create directories and bake in demo files
RUN mkdir -p /home/guest /home/demo
WORKDIR /home/guest

# Copy demo files (from server/demo/ in the build context)
COPY demo/demo.py       /home/demo/demo.py
COPY demo/tech-stack.md /home/demo/tech-stack.md
RUN chmod 644 /home/demo/demo.py /home/demo/tech-stack.md
