# backend/Dockerfile
# Team Members:
# Lasya Reddy Mekala (G01473683)
# Supraja Naraharisetty (G01507868)
# Trinaya Kodavati (G01506073)
# Dhaanya S Garapati (G01512900)

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app/app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host","0.0.0.0", "--port","8000"]
