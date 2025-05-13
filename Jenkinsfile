pipeline {
    agent any

    environment {
        TARGET_DIR = "target"
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
                    [ -d demo/lib ] || { echo "Brakuje katalogu lib"; exit 1; }
                '''
            }
        }

        stage('Build') {
            steps {
                script {
                    // Tworzymy wymagane katalogi
                    sh 'mkdir -p target/classes target/test-classes target/reports'

                    // Kompilacja aplikacji bez uwzględniania katalogu lib
                    sh 'javac -cp . -d target/classes demo/src/main/java/com/example/demo/DemoApplication.java'

                    // Kompilacja testów bez uwzględniania katalogu lib
                    sh 'javac -cp target/classes -d target/test-classes demo/src/test/java/com/example/demo/DemoApplicationTests.java'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Uruchomienie testów, zakładając, że mamy odpowiednią wersję JUnit w katalogu lib
                    try {
                        sh '''
                            java -jar lib/junit-platform-console-standalone-*.jar \
                                --class-path ${CLASS_DIR}:${TEST_DIR} \
                                --scan-class-path \
                                --reports-dir=${REPORT_DIR}
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
