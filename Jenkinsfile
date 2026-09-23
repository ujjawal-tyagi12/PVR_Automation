pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
        }
    }

    environment {
        CI = 'true'
        BASE_URL = credentials('base-url')
        API_BASE_URL = credentials('api-base-url')
        TEST_USERNAME = credentials('test-username')
        TEST_PASSWORD = credentials('test-password')
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Type-check') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Rule engine') {
            steps {
                sh 'npm run rules:check'
            }
        }

        stage('Lint') {
            steps {
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
            archiveArtifacts artifacts: 'playwright-report/**, tta-report/**, test-results/**', allowEmptyArchive: true
        }
    }
}
