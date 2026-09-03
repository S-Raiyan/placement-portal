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

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy fs \
                      --severity HIGH,CRITICAL \
                      --exit-code 1 \
                      --ignore-unfixed \
                      .
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

    stage('Docker Build') {
    steps {
        sh '''
            docker compose build
        '''
    }
}

stage('Trivy Docker Image Scan') {
    steps {
        sh '''
            trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 placement-backend
            trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 placement-admin
            trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 placement-student
        '''
    }
}
}