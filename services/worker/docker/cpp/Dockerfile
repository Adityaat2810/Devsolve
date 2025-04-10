FROM gcc:latest

WORKDIR /app

# Install any additional dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    time \
    && rm -rf /var/lib/apt/lists/*

# Set default command
CMD ["bash"]