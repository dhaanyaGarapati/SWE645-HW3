# # backend/Dockerfile
# FROM python:3.12-slim

# ENV PYTHONDONTWRITEBYTECODE=1 \
#     PYTHONUNBUFFERED=1

# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY app /app/app

# EXPOSE 8000
# CMD ["uvicorn", "app.main:app", "--host","0.0.0.0", "--port","8000"]

# Use a lightweight Python image
FROM python:3.11-slim

# Create workdir
WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code (current directory)
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
