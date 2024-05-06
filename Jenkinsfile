pipeline {
    agent any
    
    // Parametrización de la pipeline
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Introduzca la versión')
    }    
    environment{
    	  // Declaracion de variables de entorno
        SONAR_TOKEN = credentials('sonarcloud-token')
        //DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        //DOCKER_HUB_PASSWORD = credentials('docker-hub-token')
        //DOCKER_HUB_REPOSITORY = 'playapp_back'
        //DOCKER_IMAGE_TAG = 'latest'
        //PLAYAPP_EC2 = credentials('playapp_ec2')
        //OPENAI_API_KEY = credentials('openai-api-key')
        //ACCUWEATHER_API_KEY = credentials('accuweather-api-key')        
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
		stage('Publish Version') {
            steps {
                script {                
                    echo 'Publishing new version and creating and pushing tag in GitHub'
		    		//sh "git fetch"
                    //sh "git tag -d \$(git tag -l)"
                    def version = params.VERSION
                    
                    def packageJson = readFile "${WORKSPACE}/package.json"
                    def updatedPackageJson = packageJson.replaceAll(/"version": ".+"/, "\"version\": \" ${version}\"")
                    writeFile file: 'package.json', text: updatedPackageJson
                    // Agregar los archivos al área de preparación
                    sh "git add package.json"
                    // Realizar commit
                    sh "git commit -am 'Jenkins: actualización de la versión a ${version}'"
                    // Configurar la rama ascendente antes de realizar el push
                    withCredentials([string(credentialsId: 'personal-access-token-github', variable: 'TOKEN')]) {
                        def gitPushCommand = "git push --set-upstream https://$TOKEN@github.com/miriamcbl/playapp-fnt.git main"
                        def pushResult = sh(script: gitPushCommand, returnStatus: true)
                        if (pushResult == 0) {
                            echo "Push successful"
                        } else {
                            error "Failed to push changes"
                        }
                    }
                    // Crear tag con la versión
                    sh "git tag -a ${version} -m 'Versión ${version}'"
                    def gitPushCommand = 'git push --tags'
                    def pushResult = sh(script: gitPushCommand, returnStatus: true)
                    if (pushResult == 0) {
                            echo "Push successful"
                    } else {
                            error "Failed to push changes"
                    }
                }
            }
        }
    }
}
