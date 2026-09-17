pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
        }
    }

    environment {
        CI = 'true'
        BASE_URL = credentials('BASE_URL')
        API_BASE_URL = credentials('API_BASE_URL')
        TEST_USERNAME = credentials('TEST_USERNAME')
        TEST_PASSWORD = credentials('TEST_PASSWORD')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Quality gate') {
            steps {
                sh 'npm run rules:check'
                sh 'npm run build'
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test:ci'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**, tta-report/**', allowEmptyArchive: true
            junit testResults: 'test-results/*.xml', allowEmptyResults: true
        }
    }
}
