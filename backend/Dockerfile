# Use official Python image
FROM python:3.11-slim

# Set workdir
#Sets /app as the working directory inside the container.
#Any future commands (COPY, RUN, etc.) will run inside /app.
WORKDIR /app

# Install system dependencies required by mysqlclient
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*


# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
#Copies everything from your local backend/ folder into the container’s /app folder.
COPY backend/ .

# Expose port - Documents that the container will listen on port 8000.
EXPOSE 8000

# Run Django dev server (for Render)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
