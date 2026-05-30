Render deployment steps for the backend

1. Import repository into Render
   - Sign in to Render (https://render.com).
   - Click "New" → "Import from GitHub" and select the `DevOps-Final` repository.
   - Render will detect `render.yaml` and propose creating a service named `devops-backend`.

2. Configure service and environment
   - If prompted, confirm the Dockerfile path is `backend/Dockerfile` and branch `main`.
   - Set the Health Check path to `/api/health`.
   - Enable Auto Deploy so pushes to `main` redeploy.

3. Provide database credentials
   - Render will not create a MySQL database for you via this blueprint. You have two options:
     a) Use an external MySQL (PlanetScale, ClearDB, AWS RDS, etc.) and paste the connection values into the service Environment variables.
     b) Provision a MySQL instance elsewhere and use those credentials.

   Add these environment variables in Render (Service → Environment):
   - `MYSQL_HOST` : your-mysql-host
   - `MYSQL_PORT` : 3306
   - `MYSQL_USER` : root
   - `MYSQL_PASSWORD` : ninad2006
   - `MYSQL_DATABASE` : devops_fullstack
   - `CLIENT_ORIGIN` : https://<your-vercel-domain>

4. Deploy
   - Create the service. Render will build the Docker image using `backend/Dockerfile` and deploy the container.
   - Watch the build logs; on success the service will be live. Open the service URL and check `/api/health`.

5. Post-deploy steps
   - In your Vercel project, set `VITE_API_BASE_URL` to the Render service URL.
   - Test the app end-to-end.

Notes
 - If you want Render to host a managed MySQL instance, use another provider and paste credentials here. Render's native managed DBs are PostgreSQL-first; do not change application code unless you migrate to Postgres.
 - If the backend fails to connect at startup, check Render logs (Service → Logs) for connection errors and confirm the DB host is reachable and credentials are correct.
