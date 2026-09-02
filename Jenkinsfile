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
                              -Dsonar.sources=.
                        '''
                    }
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