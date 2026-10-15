FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./matchmaking

EXPOSE 3000

CMD ["uvicorn", "matchmaking.main:app", "--host", "0.0.0.0", "--port", "3000"]