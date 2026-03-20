pipeline {
  agent any
  environment {
    REGISTRY = 'ghcr.io'
    OWNER = "${env.CHANGE_AUTHOR ?: env.GIT_URL.split('/')[3]}"
    IMAGE_BACKEND = "${REGISTRY}/${OWNER}/job-portal-backend"
    IMAGE_FRONTEND = "${REGISTRY}/${OWNER}/job-portal-frontend"
    COMMIT_SHA = "${env.GIT_COMMIT}"
  }
  options {
    skipDefaultCheckout(false)
    timestamps()
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Backend Build') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }
    stage('Frontend Build & Test') {
      steps {
        dir('frontend') {
          sh 'npm ci --legacy-peer-deps'
          sh 'CI=true npm test -- --watchAll=false'
          sh 'npm run build'
        }
      }
    }
    stage('Docker Build & Push') {
      environment {
        DOCKER_CONFIG = "${env.WORKSPACE}/.docker"
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_PAT')]) {
          sh 'echo "${GHCR_PAT}" | docker login ghcr.io -u "${GHCR_USER}" --password-stdin'
          sh 'docker build -f backend/Dockerfile -t ${IMAGE_BACKEND}:latest -t ${IMAGE_BACKEND}:${COMMIT_SHA} .'
          sh 'docker build -f frontend/Dockerfile -t ${IMAGE_FRONTEND}:latest -t ${IMAGE_FRONTEND}:${COMMIT_SHA} .'
          sh 'docker push ${IMAGE_BACKEND}:latest'
          sh 'docker push ${IMAGE_BACKEND}:${COMMIT_SHA}'
          sh 'docker push ${IMAGE_FRONTEND}:latest'
          sh 'docker push ${IMAGE_FRONTEND}:${COMMIT_SHA}'
        }
      }
    }
    stage('Deploy to Kubernetes') {
      when {
        branch 'main'
      }
      steps {
        withKubeConfig(credentialsId: 'kubeconfig') {
          sh '''
            kubectl apply -f k8s/
            kubectl set image deployment/job-portal-backend backend=${IMAGE_BACKEND}:${COMMIT_SHA} -n job-portal || true
            kubectl set image deployment/job-portal-frontend frontend=${IMAGE_FRONTEND}:${COMMIT_SHA} -n job-portal || true
          '''
        }
      }
    }
  }
  post {
    always {
      sh 'docker logout ghcr.io || true'
    }
  }
}
