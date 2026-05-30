pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        IMAGE_NAME = 'devops-backend'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/NinadHebbar1029/DevOps-Final.git'
            }
        }

        // ---------------- BACKEND ----------------
        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh 'npm test || echo "No tests yet"'
                }
            }
        }

        stage('SonarQube Analysis (Backend)') {
            steps {
                dir('backend') {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=backend-project \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        // ---------------- DOCKER ----------------
        stage('Build Docker Image (Backend)') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -f backend/Dockerfile backend'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 4000:4000 --name ${IMAGE_NAME}_${BUILD_NUMBER} ${IMAGE_NAME}:${BUILD_NUMBER}'
            }
        }

        // ---------------- OPTIONAL DEPLOY ----------------
        stage('Deploy Backend (Render/Railway Trigger)') {
            steps {
                sh 'echo "Trigger deploy via webhook or GitHub integration"'
            }
        }
    }
}