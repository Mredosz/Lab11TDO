pipeline {
    agent any

    environment {
        BASE_DIR = 'demo'
        TARGET_DIR = "${BASE_DIR}/target"
        CLASS_DIR = "${TARGET_DIR}/classes"
        TEST_DIR = "${TARGET_DIR}/test-classes"
        REPORT_DIR = "${TARGET_DIR}/reports"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Mredosz/Lab11TDO.git', branch: 'main'
            }
        }

        stage('Validation') {
            steps {
                sh '''
                    [ -d demo/src/main/java ] || { echo "Brakuje katalogu demo/src/main/java"; exit 1; }
                    [ -d demo/src/test/java ] || { echo "Brakuje katalogu demo/src/test/java"; exit 1; }
                    [ -d demo/lib ] || { echo "Brakuje katalogu demo/lib/"; exit 1; }
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    mkdir -p ${CLASS_DIR} ${TEST_DIR} ${REPORT_DIR}

                    # Kompilacja kodu aplikacji
                    javac -cp "${BASE_DIR}/lib/*" -d ${CLASS_DIR} $(find ${BASE_DIR}/src/main/java -name "*.java")

                    # Kompilacja testów
                    javac -cp "${CLASS_DIR}:${BASE_DIR}/lib/*" -d ${TEST_DIR} $(find ${BASE_DIR}/src/test/java -name "*.java")
                '''
                stash includes: "${TARGET_DIR}/classes/**,${TARGET_DIR}/test-classes/**,${BASE_DIR}/lib/**", name: 'compiled'
            }
        }

        stage('Test') {
            steps {
                unstash 'compiled'
                script {
                    try {
                        sh '''
                            java -jar demo/lib/junit-platform-console-standalone.jar \
                                --class-path demo/target/classes:demo/target/test-classes:demo/lib/* \
                                --scan-class-path \
                                --reports-dir=demo/target/reports
                        '''
                    } finally {
                        junit "${REPORT_DIR}/*.xml"
                    }
                }
            }
        }

        stage('Package') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    jar cf app-${BUILD_ID}.jar -C ${CLASS_DIR} .
                '''
            }
        }

        stage('Archive') {
            when {
                branch 'main'
            }
            steps {
                archiveArtifacts artifacts: "app-${BUILD_ID}.jar"
                archiveArtifacts artifacts: "${REPORT_DIR}/*.xml"
            }
        }
    }
}