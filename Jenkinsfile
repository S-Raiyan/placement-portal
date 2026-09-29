pipeline {
    agent any

    stages {

        stage('Build Test') {
            steps {
                echo 'Placement Portal CI/CD pipeline started successfully!'
                sh 'echo Repository checkout successful'
            }
        }

        stage('SonarQube Analysis') {
            steps {

                withSonarQubeEnv(
                    installationName: 'SonarQube',
                    credentialsId: 'sonarqube-token-new'
                ) {

                    withEnv(["PATH+SONAR=${tool 'SonarScanner'}/bin"]) {

                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=placement-portal \
                              -Dsonar.projectName=placement-portal \
                              -Dsonar.sources=. \
                              -Dsonar.sourceEncoding=UTF-8 \
                              -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/build/**,**/.git/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.webp,**/*.ico,**/*.pdf" \
                              -Dsonar.javascript.createTSProgramForOrphanFiles=false
                        '''
                    }
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    echo "Running Trivy filesystem security scan..."

                    trivy fs \
                      --severity HIGH,CRITICAL \
                      --exit-code 0 \
                      --ignore-unfixed \
                      .
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    echo "Building Docker images..."

                    docker compose build
                '''
            }
        }

        stage('Trivy Docker Image Scan') {
            steps {
                sh '''
                    echo "Scanning backend image..."

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      placement-backend:latest

                    echo "Scanning admin portal image..."

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      placement-admin:latest

                    echo "Scanning student portal image..."

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      placement-student:latest
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    set -e

                    AWS_REGION="ap-south-1"

                    AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
                        --query Account \
                        --output text)

                    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                    echo "========================================="
                    echo "Logging in to Amazon ECR"
                    echo "========================================="

                    aws ecr get-login-password \
                        --region "$AWS_REGION" | \
                        docker login \
                        --username AWS \
                        --password-stdin "$ECR_REGISTRY"

                    echo "========================================="
                    echo "Tagging Docker images"
                    echo "========================================="

                    docker tag placement-backend:latest \
                        "$ECR_REGISTRY/placement-backend:latest"

                    docker tag placement-admin:latest \
                        "$ECR_REGISTRY/placement-admin:latest"

                    docker tag placement-student:latest \
                        "$ECR_REGISTRY/placement-student:latest"

                    echo "========================================="
                    echo "Pushing backend image"
                    echo "========================================="

                    docker push \
                        "$ECR_REGISTRY/placement-backend:latest"

                    echo "========================================="
                    echo "Pushing admin image"
                    echo "========================================="

                    docker push \
                        "$ECR_REGISTRY/placement-admin:latest"

                    echo "========================================="
                    echo "Pushing student image"
                    echo "========================================="

                    docker push \
                        "$ECR_REGISTRY/placement-student:latest"

                    echo "========================================="
                    echo "All images pushed to ECR successfully!"
                    echo "========================================="
                '''
            }
        }

        stage('Kubernetes Rollout') {
            steps {
                sh '''
                    set -e

                    NAMESPACE="placement-portal"
                    K3S="sudo -n /usr/local/bin/k3s kubectl"

                    echo "========================================="
                    echo "Starting Kubernetes rollout"
                    echo "========================================="

                    echo "Restarting backend deployment..."
                    $K3S rollout restart \
                        deployment/placement-backend \
                        -n "$NAMESPACE"

                    echo "Restarting admin deployment..."
                    $K3S rollout restart \
                        deployment/placement-admin \
                        -n "$NAMESPACE"

                    echo "Restarting student deployment..."
                    $K3S rollout restart \
                        deployment/placement-student \
                        -n "$NAMESPACE"

                    echo "========================================="
                    echo "Waiting for backend rollout..."
                    echo "========================================="

                    $K3S rollout status \
                        deployment/placement-backend \
                        -n "$NAMESPACE" \
                        --timeout=180s

                    echo "Backend rollout successful!"

                    echo "========================================="
                    echo "Waiting for admin rollout..."
                    echo "========================================="

                    $K3S rollout status \
                        deployment/placement-admin \
                        -n "$NAMESPACE" \
                        --timeout=180s

                    echo "Admin rollout successful!"

                    echo "========================================="
                    echo "Waiting for student rollout..."
                    echo "========================================="

                    $K3S rollout status \
                        deployment/placement-student \
                        -n "$NAMESPACE" \
                        --timeout=180s

                    echo "Student rollout successful!"

                    echo "========================================="
                    echo "Kubernetes rollout completed successfully!"
                    echo "========================================="

                    echo "Current Kubernetes pods:"

                    $K3S get pods \
                        -n "$NAMESPACE" \
                        -o wide
                '''
            }
        }
    }

    post {

        success {
            echo 'Pipeline completed successfully!'
            echo 'Docker images are available in Amazon ECR.'
            echo 'Kubernetes deployments rolled out successfully.'
        }

        failure {
            echo 'Pipeline failed!'
        }

        always {
            echo 'CI/CD pipeline execution finished.'
        }
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> efe67356e9dcce5bc4f71c512d0a6ee064a0ee74
