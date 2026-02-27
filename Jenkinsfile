pipeline {
    agent any
    
    environment {
        BRANCH_NAME = 'master'  
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Check Hosts') {
            steps {
                bat 'echo %DOCKER_HOST%'
            }
        }

        stage('Build') {
            steps {
                 bat '''
                    cd ./serv1
                    call npm install
                    docker compose up --build -d
                    cd ../serv2
                    call npm install
                    docker compose up --build -d
                    cd ../
                    docker compose up --build -d
                    docker ps -a
                '''

                
            }
        }
        
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
    }
    
    post {
        always {
            echo 'Building complete'
        }
    }
}
