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
    }

    post {

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }

        always {
            echo 'CI/CD pipeline execution finished.'
        }
    }
}