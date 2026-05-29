# Deployment Roadmap

## Goal

Use Vercel for the frontend and Render for the backend. Keep Jenkins only if you want a build gate or Docker image workflow later.

## Recommended flow

1. Developer pushes code to GitHub.
2. Vercel is connected to the repository and builds the frontend automatically.
3. Render is connected to the backend folder and deploys on push.
4. Set `VITE_API_BASE_URL` in Vercel to the Render backend URL.
5. Set `PORT`, `CLIENT_ORIGIN`, and MySQL environment variables in Render.

## Optional Jenkins setup

1. Keep Jenkins on your local host at port 8080 if you still want a build pipeline.
2. Use SCM polling on the GitHub repo instead of ngrok.
3. Build the backend image only if you want a Docker-based deployment later.

## Optional SonarQube setup

1. SonarQube usually runs on port 9000 unless you changed it.
2. Add it only if you want code-quality checks before deployment.

## Vercel frontend setup

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Add `VITE_API_BASE_URL` in Vercel environment variables and point it to the deployed backend URL.
4. Push to GitHub; Vercel will auto-deploy the frontend from the connected branch.

## Render backend setup

1. Deploy the backend service from `backend`.
2. Use a managed MySQL database or point the service to an external MySQL instance.
3. Set the same environment variables used in `.env.example`.
4. If you want, deploy from Docker later, but GitHub deploys are enough for this simple site.

## Local development

1. Start MySQL with Docker Compose.
2. Run the backend and frontend in separate dev servers.
3. Verify the frontend can reach the backend via `VITE_API_BASE_URL`.