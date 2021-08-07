# 설치하기
npm i

# API list
store list : localhost:3000/api/store/

list of a specific item name of store  : localhost:3000/api/store?column={itemname}

the latitude and longitude for each postcode  : localhost:3000/api/store/geoinfo

return a list of stores in a given radius of a given postcode in the UK : localhost:3000/api/store/search_by_geo?postcode={postcode}&radius={radius in meters}


# answer 
 - If you had chosen to spend more time on this test, what would you have done differently?
   : 실무에 최대한 가깝게 작성하고자 하였습니다. 

 - What part did you find the hardest? What part are you most proud of? In both cases, why?
   : radius안에 있는 postcode를 구하는 과정에서 postcode.io에 기능을 써야하는지 알고 그 라이브러리의 스펙을 보는데 시간이 좀 결렸습니다. 요구사항이 좀 rough해서 의도에 맞게 작성이 되었는지 잘 모르겠습니다.
   
 - What is one thing we could do to improve this test?
   : 개인적으로 본 코딩테스트 중에 제일 실무와 가까웠던거 같습니다. 좀더 requirement가 자세하면 더 좋겠습니다. 
