# Swasth Saathi Production Deployment Guide

## Local Development

1. Install Docker and Docker Compose.
2. Run: `docker-compose up --build`
3. Backend: http://localhost:3000
4. ML Service: http://localhost:8000
5. Postgres: localhost:5432

## Production VPS Deployment

1. Clone repo to VPS.
2. Set environment variables in `.env` files for backend and ML service.
3. Use Nginx as reverse proxy:
   - Proxy backend (port 3000) and ML service (port 8000)
   - Enable SSL via Let's Encrypt
4. Run: `docker-compose up --build -d`
5. For scaling ML service, use multiple replicas and load balancer.

## Security Checklist
- Use HTTPS only (SSL termination at Nginx)
- JWT stored in HTTP-only cookies
- Helmet for security headers
- CORS restrictions
- Input validation (Joi/Zod)
- Prisma for SQL injection protection
- Rate limiting (100 req/min)
- Encrypt sensitive DB fields
- Audit logging for all critical events

## Scaling Notes
- Horizontal scaling: Docker Swarm/Kubernetes
- Load balancer: Nginx/HAProxy
- Caching: Redis (future)
- Model versioning: MLflow
- Data anonymization pipeline for analytics

---

For any issues, check logs in backend and ML service containers.
