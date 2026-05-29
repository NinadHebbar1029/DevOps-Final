pipeline {
  agent any

  triggers {
    pollSCM('H/5 * * * *')
  }

  environment {
    NODE_ENV = 'production'
    IMAGE_NAME = 'devops-full-stack-backend'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
        sh 'npm install -w frontend'
        sh 'npm install -w backend'
      }
    }

    stage('Quality') {
      steps {
        sh 'npm run typecheck'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh 'echo "Run sonar-scanner here with your configured project key"'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -f backend/Dockerfile .'
      }
    }

    stage('Deploy Backend') {
      steps {
        sh 'echo "Use Railway or Render deploy hook / image deployment here"'
      }
    }
  }
}