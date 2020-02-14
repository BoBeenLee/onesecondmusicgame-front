![Logo of the project](./images/logo.sample.png)

# OneSecondMusicGame &middot; [![Build Status](https://img.shields.io/travis/npm/npm/latest.svg?style=flat-square)](https://travis-ci.org/npm/npm) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)](https://www.npmjs.com/package/npm) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)

> Additional information or tag line

## 폴더 구조


    onesecondmusicgame-front
    ├── src
    ├──── apis           # rest api 요청들
    ├──── components     # 컴포넌트 단위 분리
    ├──── configs        # firebase, 내부환경..etc 설정 관련 파일들
    ├──── decorators     # 추상화된 데코레이터
    ├──── hocs           # higher order component   
    ├──── hooks          # react hooks 함수들
    ├──── images         # 이미지 저장소
    ├──── interfaces     # ts 공통인터페이스
    ├──── screens        # 앱내 화면들
    ├──── stores         # 도메인 기반 stores
    ├──── styles         # 컬러셋, 테마, zIndex
    ├──── utils          # 유틸리티 함수들
    ├── web              # 웹뷰용 gatsby프로젝트
    ├── storybook        # 스토리북 환경설정
    ├── typings          # global 타입 정의
    └── README.md

## Storybook

- http://onesecondmusicgame.surge.sh/

## Installing / Getting started

```shell
npm install

# ios
cd ios
pod install
```

### IOS Running

```shell
npm run ios
```

### Android Running

```shell
npm run android
```

## Developing

### Built With

React, React Native ...

### Prerequisites

Xcode 최신버젼, node 10이상

### Deploying / Publishing

- 코드푸쉬 apply 예시

```
code-push release-react onesecondmusicgame/onesecondmusicgame-android android -d Production -m true --privateKeyPath ~/private.pem --description "헬로우 월드44"

code-push release-react onesecondmusicgame/onesecondmusicgame-ios ios -d Production -m true --privateKeyPath ~/private.pem --description "헬로우 월드44" --plistFile "ios/RNApp/Info.plist"
```

give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Versioning

We can maybe use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).

## [Commit Convention](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

## Configuration

config.json 파일 환경 설정
- development
- staging
- production
- storybook

## Tests

```shell
npm test
```

## Style guide

stylelint, eslint

## Api Reference

- http://34.84.5.51:8888/swagger-ui.html#/music45user45controller

