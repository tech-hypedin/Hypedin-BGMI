# Hypedin-BGMI: Ambassador Management & Engagement System

A high-performance, containerized MERN stack platform designed for the automated management of ambassador networks. This project is engineered for low-latency communication, resource efficiency, and production-grade stability on a 2-core VPS environment.

## 🛡️ Engineering Highlights
- **PM2 Cluster Mode:** Optimized for 2-core CPUs to handle concurrent requests without bottlenecks.
- **Intelligent SSL Termination:** Nginx handles HTTPS/WSS encryption at the edge, offloading the CPU-heavy handshake from the Node.js backend.
- **Hybrid Next.js Networking:** Implements 'use client' to offload rendering to the user's browser, maintaining a lean ~40MB RAM footprint for the frontend container.
- **WebSocket Tunneling:** Dedicated Nginx location blocks for `/socket.io/` with custom upgrade headers and extended timeouts (24h) for persistent player connections.
- **Resource Guardrails:** Strict Docker memory limits and reservations (3GB Backend / 1GB Frontend) to ensure OS stability on an 8GB RAM host.

## 🛠️ Technical Stack
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Socket.io-client.
- **Backend:** Node.js, TypeScript, Express, PM2.
- **Real-time:** Socket.io with Redis-backed adapters for horizontal scaling.
- **Database:** MongoDB 8.0 (containerized with persistent volumes).
- **Infrastructure:** Nginx (Alpine), Docker Compose, Let's Encrypt (Certbot).

## 🏗️ Production Architecture
The system follows a Reverse Proxy pattern where Nginx acts as the single entry point, orchestrating traffic between the client and the internal Docker bridge network.

### 1. Networking Logic
| Description | URL |
|---|---|
| Public API | [https://yourdomain.com](https://yourdomain.com) *(Used by browsers for Client-side logic)* |
| Internal API | [http://hypedin-BGMI_backend:3000](http://hypedin-BGMI_backend:3000) *(Used for fast Server-to-Server communication within the Docker network)* |

### 2. Deployment Orchestration
The project uses `docker-compose` to manage the lifecycle of 5 core services:
- **Frontend:** Next.js server serving the UI.
- **Backend:** Node.js cluster handling logic and WebSockets.
- **Redis:** Pub/Sub for Socket.io synchronization.
- **MongoDB:** Primary data persistence.

## 📦 Local Development & Simulation
To test the production-ready Nginx routing locally:

### Add Local Domain:
Map `127.0.0.1 hypedin-bgmi.local` in your `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`.

### Environment Setup:
bash:
```
-$~ cp ./env.example ./env    #change the values insode the env file to match the requirements
```

### Launch:
bash code block:
```
-$~ docker-compose --env-file ./.env up --build
```

## 🚀 VPS Deployment Checklist
- [ ] Ensure port `443` is open in the VPS firewall.
- [ ] Point Domain DNS (`A Record`) to the VPS IP.
- [ ] Run Certbot to generate certificates in `/etc/letsencrypt`.
- [ ] Verify `docker stats` to ensure frontend build doesn't exceed 1GB.
- [ ] Monitor PM2 logs: `docker exec -it hypedin-BGMI_backend pm2 monit.`

**Developed by Mitul — Expertise in Full-Stack MERN Development & DevOps Optimization.**
