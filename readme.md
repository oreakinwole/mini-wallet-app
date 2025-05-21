## Development Setup

2. **Create environment file**

Create a `.env` file in the project root with the following variables:

```plaintext
# Database settings
DB_NAME=miniwallet_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# Django settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000

# Monnify API settings
MONNIFY_API_KEY=your_monnify_api_key
MONNIFY_SECRET_KEY=your_monnify_secret_key
MONNIFY_CONTRACT_CODE=your_monnify_contract_code
MONNIFY_BASE_URL=https://sandbox.monnify.com
MONNIFY_REDIRECT_URL=http://localhost:3000/payment-callback
```

3. **Build and start the containers**


```shellscript
docker-compose up --build
```

4. **Access the application**


- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api](http://localhost:8000/api)
- Django Admin: [http://localhost:8000/admin](http://localhost:8000/admin)