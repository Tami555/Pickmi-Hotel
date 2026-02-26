FROM python:3.12-slim
RUN groupadd -r groupbackend && useradd -r -g groupbackend userfast

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/www/pickmi_hotel

COPY pyproject.toml poetry.lock* ./

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --only main

COPY . .

USER userfast
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]