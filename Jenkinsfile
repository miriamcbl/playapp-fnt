pipeline {
    agent any
    
    // Parametrización de la pipeline
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Introduzca la versión')
    }    
    environment{
    	// Declaracion de variables de entorno
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-token')
        DOCKER_HUB_REPOSITORY = 'playapp_fnt'
        DOCKER_IMAGE_TAG = 'latest'
        PLAYAPP_EC2_FNT = credentials('playapp_ec2_fnt')
        PLAYAPP_EC2 = credentials('playapp_ec2')      
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
        stage('SonarCloud Verify') {
            steps {
                // Verificar el estado del Quality Gate                
                script {
        	    echo 'Verifying Sonar quailty gate status'
                    def qualityGateUrl = "https://sonarcloud.io/api/qualitygates/project_status?projectKey=miriamcbl_playapp-fnt"
                    // llamada http especificando el codigo que se considera valido
                    def response = httpRequest(url: qualityGateUrl, validResponseCodes: '200')
                    // parse a json
                    def status = readJSON text: response.content                    
                    if (status.projectStatus.status == 'ERROR') {
                        def conditions = status.projectStatus.conditions
                        def errorConditions = conditions.findAll { it.status == 'ERROR' }                        
                        def errorMessages = errorConditions.collect { "- ${it.metricKey}: ${it.status}" }
                        def errorMessage = "Quality Gate failed with the following conditions:\n${errorMessages.join('\n')}"
                        
                        error errorMessage
                    }
                }                
            }
        }
        stage('Security properties'){
        	steps {
        		script {
        			echo 'Injecting the sensitive properties'		
		            def propertiesDir = "${WORKSPACE}/package.json"
					sh "chmod g+w ${propertiesDir}"
		            // Se lee el properties
		            def propertiesFile = readFile(propertiesDir)
                    def hostserver = "ng serve --host ${PLAYAPP_EC2_FNT} --port 8080"
                    echo hostserver
		            // Se actualiza con las secrets 
		            propertiesFile = propertiesFile.replaceAll('ng serve', hostserver)		
		            // se escribe todo
		            writeFile file: propertiesDir, text: propertiesFile
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
                    sh "git commit -am 'Jenkins: actualización a la versión ${version}'"
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

                    sh "docker build --no-cache --build-arg APP_FILE=app.zip -t ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG} ."
                    //sh "docker tag ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG} ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG}"
                    sh "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
                    sh "docker push ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG}"
                }
            }
        }
        stage("Deploy") {
            steps {
                script {
                    echo 'Deploying image to EC2 - Playapp'
                    def dockerRunCmd = "docker run --name playapp_frontend -p 80:80 -d ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG}"
                    def dockerLoginCmd = "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
                    def dockerPullCmd = "docker pull docker.io/${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPOSITORY}:${DOCKER_IMAGE_TAG}"
                    def dockerStopCmd = "docker stop playapp_frontend"
                    def dockerRmvCmd = "docker rm playapp_frontend"
                    // conexion ssh al server playapp
                    sshagent(['ssh-keys-rsa']) {
                    	echo "Conectados a server playapp"
                        // Inicia sesión en Docker Hub
                        sh "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${dockerLoginCmd}'"
                        // Baja los últimos cambios subidos
                        sh "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${dockerPullCmd}'"
                        // Verificar si el contenedor está en ejecución antes de detenerlo
                        def checkContainerRunningCmd = "docker ps --filter name=playapp_frontend --format {{.Names}}"
                        def checkContainerCreatedCmd = "docker ps -a --filter name=playapp_frontend --format {{.Names}}"   
                        def checkExistsContainerRunning = sh(script: "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${checkContainerRunningCmd}'", returnStdout: true).trim()
                        def checkExistsContainerCreated = sh(script: "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${checkContainerCreatedCmd}'", returnStdout: true).trim()
                        if (checkExistsContainerRunning == 'playapp_frontend') {
                            echo "Existe contenedor activo, se procede parar"
                            sh "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${dockerStopCmd}'"
                        }
                        if (checkExistsContainerCreated == 'playapp_frontend'){
                        	echo "Existe contenedor creado, se elimina"
                            sh "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${dockerRmvCmd}'"
                        }
                        sh "ssh -o StrictHostKeyChecking=no ${PLAYAPP_EC2} '${dockerRunCmd}'"
                    }
                }
            }
        }

    }
}
