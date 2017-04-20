node('master') {
  checkout scm

  nodejs(nodeJSInstallationName: 'NodeJS 6.x') {
    stage('Install') {
      sh 'npm prune && npm install'
    }

    stage('Setup - CI') {
      sh 'npm run setup:ci'
    }

    stage ('Build - Demo Apps') {
      sh 'npm run build:demo-apps'
    }

    stage('Test') {
      sh 'npm test'
    }
  }

  milestone 1
}
