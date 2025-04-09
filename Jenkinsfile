pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/bellogate-caliphate-2024/QuickReels-service.git'
            }
        }
        stage('Build') {
            steps {
                sh 'make' // Assuming you have a Makefile for building your project
            }
        }
        stage('Test') {
            steps {
                sh 'make check' // Assuming you have a Makefile target for running tests
                junit 'test-reports/**/*.xml' // Assuming your tests generate JUnit XML reports
            }
        }
        stage('Archive') {
            steps {
                archiveArtifacts 'target/*.jar' // Archive the built artifacts
            }
        }
    }
    post {
        failure {
            echo 'Build failed, please check the logs.'
        }
        success {
            echo 'Build successful!'
        }
    }
}
