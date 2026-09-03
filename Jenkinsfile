pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '858208763681'

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        BACKEND_IMAGE = "${ECR_REGISTRY}/placement-backend:latest"
        ADMIN_IMAGE   = "${ECR_REGISTRY}/placement-admin:latest"
        STUDENT_IMAGE = "${ECR_REGISTRY}/placement-student:latest"

        K8S_NAMESPACE = 'placement-portal'
    }

    stages {

        stage('Build Test') {
            steps {
                echo '========================================='
                echo 'Placement Portal CI/CD Pipeline Started'
                echo '========================================='

                sh '''
                    echo "Repository checkout successful"
                    echo "Workspace:"
                    pwd
                    echo "Files:"
                    ls -la
                '''
            }
        }

        stage('AWS Authentication Check') {
            steps {
                sh '''
                    echo "Checking AWS identity..."

                    aws sts get-caller-identity

                    echo "AWS authentication successful"
                '''
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
                            echo "========================================="
                            echo "Running SonarQube Analysis"
                            echo "========================================="

                            sonar-scanner \
                              -Dsonar.projectKey=placement-portal \
                              -Dsonar.projectName=placement-portal \
                              -Dsonar.sources=. \
                              -Dsonar.sourceEncoding=UTF-8 \
                              -Dsonar.exclusions="**/node_modules/**,**/dist/**,**/build/**,**/.git/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.webp,**/*.ico,**/*.pdf" \
                              -Dsonar.javascript.createTSProgramForOrphanFiles=false

                            echo "SonarQube analysis completed"
                        '''
                    }
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Running Trivy Filesystem Security Scan"
                    echo "========================================="

                    trivy fs \
                      --severity HIGH,CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      .

                    echo "Trivy filesystem scan passed"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Building Docker Images"
                    echo "========================================="

                    docker compose build --no-cache

                    echo "Docker images built successfully"

                    docker images | grep placement
                '''
            }
        }

        stage('Trivy Docker Image Scan') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Scanning Backend Image"
                    echo "========================================="

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 1 \
                      placement-backend:latest

                    echo "Backend image scan passed"

                    echo "========================================="
                    echo "Scanning Admin Image"
                    echo "========================================="

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 1 \
                      placement-admin:latest

                    echo "Admin image scan passed"

                    echo "========================================="
                    echo "Scanning Student Image"
                    echo "========================================="

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 1 \
                      placement-student:latest

                    echo "Student image scan passed"
                '''
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Logging into Amazon ECR"
                    echo "========================================="

                    aws ecr get-login-password \
                      --region ${AWS_REGION} | \
                    docker login \
                      --username AWS \
                      --password-stdin ${ECR_REGISTRY}

                    echo "ECR login successful"
                '''
            }
        }

        stage('Tag Docker Images') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Tagging Docker Images for ECR"
                    echo "========================================="

                    docker tag placement-backend:latest ${BACKEND_IMAGE}
                    docker tag placement-admin:latest ${ADMIN_IMAGE}
                    docker tag placement-student:latest ${STUDENT_IMAGE}

                    echo "Images tagged successfully"

                    docker images | grep ${AWS_ACCOUNT_ID}.dkr.ecr
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Pushing Backend Image to ECR"
                    echo "========================================="

                    docker push ${BACKEND_IMAGE}

                    echo "Backend image pushed"

                    echo "========================================="
                    echo "Pushing Admin Image to ECR"
                    echo "========================================="

                    docker push ${ADMIN_IMAGE}

                    echo "Admin image pushed"

                    echo "========================================="
                    echo "Pushing Student Image to ECR"
                    echo "========================================="

                    docker push ${STUDENT_IMAGE}

                    echo "Student image pushed successfully"
                '''
            }
        }

        stage('Verify ECR Images') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Verifying ECR Images"
                    echo "========================================="

                    aws ecr describe-images \
                      --repository-name placement-backend \
                      --region ${AWS_REGION} \
                      --query 'imageDetails[-1].imageTags'

                    aws ecr describe-images \
                      --repository-name placement-admin \
                      --region ${AWS_REGION} \
                      --query 'imageDetails[-1].imageTags'

                    aws ecr describe-images \
                      --repository-name placement-student \
                      --region ${AWS_REGION} \
                      --query 'imageDetails[-1].imageTags'

                    echo "ECR verification successful"
                '''
            }
        }

        stage('Kubernetes Pre-Deployment Check') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Checking Kubernetes Cluster"
                    echo "========================================="

                    sudo k3s kubectl get nodes

                    echo "Checking namespace..."

                    sudo k3s kubectl get namespace ${K8S_NAMESPACE}

                    echo "Current deployments:"

                    sudo k3s kubectl get deployments \
                      -n ${K8S_NAMESPACE}

                    echo "Current pods:"

                    sudo k3s kubectl get pods \
                      -n ${K8S_NAMESPACE}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Deploying Latest Images to Kubernetes"
                    echo "========================================="

                    echo "Restarting backend..."
                    sudo k3s kubectl rollout restart \
                      deployment/placement-backend \
                      -n ${K8S_NAMESPACE}

                    echo "Restarting admin portal..."
                    sudo k3s kubectl rollout restart \
                      deployment/placement-admin \
                      -n ${K8S_NAMESPACE}

                    echo "Restarting student portal..."
                    sudo k3s kubectl rollout restart \
                      deployment/placement-student \
                      -n ${K8S_NAMESPACE}

                    echo "Kubernetes rollout started"
                '''
            }
        }

        stage('Kubernetes Rollout Verification') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Waiting for Backend Rollout"
                    echo "========================================="

                    sudo k3s kubectl rollout status \
                      deployment/placement-backend \
                      -n ${K8S_NAMESPACE} \
                      --timeout=180s

                    echo "Backend rollout successful"

                    echo "========================================="
                    echo "Waiting for Admin Rollout"
                    echo "========================================="

                    sudo k3s kubectl rollout status \
                      deployment/placement-admin \
                      -n ${K8S_NAMESPACE} \
                      --timeout=180s

                    echo "Admin rollout successful"

                    echo "========================================="
                    echo "Waiting for Student Rollout"
                    echo "========================================="

                    sudo k3s kubectl rollout status \
                      deployment/placement-student \
                      -n ${K8S_NAMESPACE} \
                      --timeout=180s

                    echo "Student rollout successful"
                '''
            }
        }

        stage('Kubernetes Verification') {
            steps {
                sh '''
                    echo "========================================="
                    echo "Final Kubernetes Verification"
                    echo "========================================="

                    echo "PODS:"
                    sudo k3s kubectl get pods \
                      -n ${K8S_NAMESPACE} \
                      -o wide

                    echo ""
                    echo "DEPLOYMENTS:"
                    sudo k3s kubectl get deployments \
                      -n ${K8S_NAMESPACE}

                    echo ""
                    echo "SERVICES:"
                    sudo k3s kubectl get services \
                      -n ${K8S_NAMESPACE}

                    echo ""
                    echo "INGRESS:"
                    sudo k3s kubectl get ingress \
                      -n ${K8S_NAMESPACE}

                    echo ""
                    echo "========================================="
                    echo "Kubernetes deployment verification passed"
                    echo "========================================="
                '''
            }
        }
    }

    post {

        success {
            echo '========================================='
            echo 'CI/CD PIPELINE SUCCESS'
            echo '========================================='
            echo 'Code successfully passed:'
            echo '✓ SonarQube'
            echo '✓ Trivy filesystem scan'
            echo '✓ Docker build'
            echo '✓ Trivy image scans'
            echo '✓ ECR push'
            echo '✓ Kubernetes deployment'
            echo '✓ Kubernetes rollout'
            echo '✓ Kubernetes verification'
            echo '========================================='
        }

        failure {
            echo '========================================='
            echo 'CI/CD PIPELINE FAILED'
            echo '========================================='
            echo 'Check the failed stage in Jenkins Console Output.'
            echo '========================================='
        }

        always {
            echo 'CI/CD pipeline execution finished.'
        }
    }
}