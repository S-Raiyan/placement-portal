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
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=placement-portal \
                          -Dsonar.projectName=placement-portal \
                          -Dsonar.sources=.
                    '''
                }
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
    }
}