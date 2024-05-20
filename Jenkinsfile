pipeline {
    agent any
    
    // Parametrización de la pipeline
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Introduzca la versión')
    }    
    environment{
    	  // Declaracion de variables de entorno
        //SONAR_TOKEN = credentials('sonarcloud-token')
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-token')
        DOCKER_HUB_REPOSITORY = 'playapp_fnt'
        DOCKER_IMAGE_TAG = 'latest'
        //PLAYAPP_EC2 = credentials('playapp_ec2')
        //OPENAI_API_KEY = credentials('openai-api-key')
        //ACCUWEATHER_API_KEY = credentials('accuweather-api-key')        
    }
    tools {
        NODEJS_VERSION = '14'
    }

    stages {
        stage('Checkout') {
            steps {
           	echo 'Cloning git repo'
                // Clonar el repositorio de GitHub
                git branch: 'main', url: 'https://github.com/miriamcbl/playapp-fnt.git'
            }
        }
        stage('NPM Build') {
            steps {
                script {
		    		echo 'Building project with npm'
                    sh 'npm install'
                }
            }
        }		
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building and pushing docker image - Playapp'

                    def directoryPath = '/var/lib/jenkins/workspace/playapp-fnt-pipeline'
                    def zipFileName = 'app.zip'                    
                    
                    sh """
                        if [ -f ${zipFileName} ]; then
                            echo "app.zip existe dentro del workspace"
                            rm ${zipFileName}
                            echo "Se ha eliminado app.zip"
                        fi
                    """
                    sh "cd ${directoryPath} && zip -r ${env.WORKSPACE}/${zipFileName} ."

                    sh 'ls -l'

                    sh "docker build  --build-arg APP_FILE=app.zip -t ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG} ."
                    //sh "docker tag ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG} ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG}"
                    sh "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
                    sh "docker push ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG}"
                }
            }
        }
    }
}