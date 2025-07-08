## 프로젝트명 : movie-ticket
[테스트 영상](https://dayoon07.github.io/video/movie-ticket-test.mp4)

## 목차 
1. [프로젝트 팀원]()
2. [프로젝트 소개](#프로젝트-소개)
3. [개발 기간](#개발-기간)
4. [IDE](#ide)
5. [DB & 서버](#db--서버)
6. [프레임워크](#프레임워크)
7. [언어](#언어)
8. [라이브러리](#라이브러리)
9. [빌드 도구](#빌드-도구)
10. [ERD](#erd)
11. [기능 설명](#기능-설명)

## 프로젝트 팀원 소개

<table border="1" style="width: 100%; border-collapse: collapse;">
    <tr>
        <td style="padding: 7.5px 15px; text-align: center;">백엔드 개발</td>
        <td style="padding: 7.5px 15px; text-align: center;">프론트엔드 개발</td>
        <td style="padding: 7.5px 15px; text-align: center;" colspan="3">PPT 제작</td>
    </tr>
    <tr>
        <td style="padding: 7.5px 15px; text-align: center;">강다윤</td>
        <td style="padding: 7.5px 15px; text-align: center;">양하민</td>
        <td style="padding: 7.5px 15px; text-align: center;">손양헌</td>
        <td style="padding: 7.5px 15px; text-align: center;">양하경</td>
        <td style="padding: 7.5px 15px; text-align: center;">진현민</td>
    </tr>
    <tr>
        <td style="padding: 7.5px 15px; width: 33%; text-align: center;">
            DB 테이블 설계, Rest API 설계, <br /> 
            영화 예매 기능, 영화 추천 AI 기능
        </td>
        <td style="padding: 7.5px 15px; width: 33%; text-align: center;">
            클라이언트 화면 설계, <br />
            예매 내역 확인, 환불 기능
        </td>
        <td style="padding: 7.5px 15px; width: 33%; text-align: center;" colspan="3">
            화면설계서, 발표용 PPT 제작
        </td>
    </tr>
</table>

## 프로젝트 소개
2025년 **고용노동부 미래유망 고졸인력양성 사업**에서 진행한 CGV 영화 예매 키오스크 프로젝트입니다. 프론트엔드는 React 기반의 SPA 프레임워크로 구현되었고, 백엔드는 Spring Boot 기반 REST API 서버로 분리되어 있으며 각각 별도의 GitHub 레포지토리로 관리됩니다. 주요 기능은 영화 예매, 좌석 선택, 티켓 출력, 환불 등이 있습니다.

## 개발 기간
<p style="font-size: 20px;">2025. 06. 01 ~ 2025. 06. 24</p>

## IDE 
![](https://img.shields.io/badge/dbeaver-382923?style=for-the-badge&logo=dbeaver&logoColor=white)
![](https://img.shields.io/badge/Spring%20Tool%20Suite%20-6DB33F?style=for-the-badge&logo=eclipse&logoColor=white)
![](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
<img src="https://dayoon07.github.io/static-page-test/devimg/sqldeveloper.png" alt="..." style="width: 25px;">

## DB & 서버
![](https://custom-icon-badges.demolab.com/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=fff)
![](https://img.shields.io/badge/Apache%20Tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black)

## 프레임워크
![](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=fff)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
<img src="https://dayoon07.github.io/static-page-test/devimg/MyBatis.png" alt="..." style="width: 28px;">
![](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![](https://img.shields.io/badge/Spring_data_jpa-6DB33F?style=for-the-badge&logo=SpringSecurity&logoColor=white)
![](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=fff)

## 언어
![](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![](https://dayoon07.github.io/img/Java-007396.svg)
![](https://img.shields.io/badge/SQL-336791?style=for-the-badge&logo=sqlite&logoColor=white)

## 라이브러리
![](https://img.shields.io/badge/React-%2320232a?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&style=for-the-badge&logoColor=white)

## 빌드 도구
![](https://img.shields.io/badge/MAVEN-000000?style=for-the-badge&logo=apachemaven&logoColor=blue)

## ERD
![](https://dayoon07.github.io/img/architecture/movie-ticket-erd.png)

## 기능 설명
1. [영화 티켓 예매 및 좌석 지정](#영화-티켓-예매-및-좌석-지정)
2. [예매 내역 확인](#예매-내역-확인)
3. [환불 기능](#환불-기능)
4. [영화 추천 AI](#영화-추천-ai)

### 영화 티켓 예매 및 좌석 지정

[프론트 코드](https://github.com/Dayoon07/react-movie-ticket-ui/blob/master/src/pages/MovieList.jsx) &nbsp; &nbsp; 
[백엔드 코드 (컨트롤러 레이어)](https://github.com/Dayoon07/springboot-movie-ticket/blob/main/movie/src/main/java/com/e/controller/RestMainController.java#L92)

![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-select-one-movie.png)
![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-movie-seat-chk.png)
![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-movie-reservation.png)

### 예매 내역 확인

- 예매 코드로 영화 정보를 가져옴, <br />
    환불 기능 구현에서 예메 티켓 조회하는 거까지는 똑같은 엔드포인트 사용

[프론트 코드](https://github.com/Dayoon07/react-movie-ticket-ui/blob/master/src/pages/ReservationTicket.jsx) &nbsp; &nbsp; 
[백엔드 코드 (컨트롤러 레이어)](https://github.com/Dayoon07/springboot-movie-ticket/blob/main/movie/src/main/java/com/e/controller/RestMainController.java#L155)

![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-movie-reservation-code.png)
![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-movie-reservation-info.png)

### 환불 기능

[프론트 코드](https://github.com/Dayoon07/react-movie-ticket-ui/blob/master/src/pages/Refund.jsx) &nbsp; &nbsp; 
[백엔드 코드 (컨트롤러 레이어)](https://github.com/Dayoon07/springboot-movie-ticket/blob/main/movie/src/main/java/com/e/controller/RestMainController.java#L155)

![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-movie-refund.png)

### 영화 추천 AI

[프론트 코드](https://github.com/Dayoon07/react-movie-ticket-ui/blob/master/src/pages/AiChatPage.jsx) &nbsp; &nbsp; 
[백엔드 코드 (컨트롤러 레이어)](https://github.com/Dayoon07/springboot-movie-ticket/blob/main/movie/src/main/java/com/e/controller/RestMainController.java#L168)

![](https://dayoon07.github.io/static-page-test/img2/movie-ticket-ai.png)
