import { APIKEY,PRIVATEKEY } from "./key.js";
const privateKey = PRIVATEKEY
const apiKey= APIKEY
const timeStamp = new Date().getTime()
var $character_owl = $("#characters_card");
var $comic_owl = $("#comics_card");

const setting = 
    {
        loop:true,
        margin:4,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            300:{
                items:3
            },
            600:{
                items:4
            },
            1000:{
                items:5
            },
            1440:{
                items:7
            },
            2560:{
                items:10
            }
        }
    }

const BASE_URL="https://gateway.marvel.com:443/v1/public/"
const hash =(privateKey,apiKey)=>{ return  CryptoJS.MD5(`${timeStamp}${privateKey}${apiKey}`)}
console.log(hash().toString());

const randomNo= ()=>{
    return Math.floor(Math.random()*2000)
}

const parentCharacterCard = document.getElementById('characters_card');
const parentComicCard = document.getElementById('comics_card');

const cards = (imgUrl,charName,id)=>{
   const childCard = document.createElement('div')
   const image = document.createElement('img')
   const cardContent = document.createElement('div')
   const cardTitle = document.createElement('div')  
   image.setAttribute('src',imgUrl);
   cardTitle.innerHTML = charName;

   childCard.classList.add('custom-card')
   image.classList.add('custom-card-image')
   cardContent.classList.add('custom-card-content')
   cardTitle.classList.add('custom-card-title')

   cardContent.appendChild(cardTitle);
   childCard.appendChild(image);
   childCard.appendChild(cardContent);

   return childCard;
}


const sendXMLRequest=(method,url,data)=>{
    const promise = new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest()
        xhr.open(method,url)
        xhr.responseType = 'json'

        xhr.onload=()=>{
            if(xhr.status >= 400){
                reject(xhr.response);
            }
            else{
                resolve(xhr.response);
            }
        };

        xhr.send(JSON.stringify(data));
    })
    return promise;
}

const getCharacters = ()=>{
    sendXMLRequest("GET",`${BASE_URL}characters?limit=14&offset=${randomNo()}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        resp.data.results.map((item)=>{
            parentCharacterCard.append(cards(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.name,item.id))
        })
        $character_owl.owlCarousel(setting); 
    }).catch(err=>{
        console.log(err)
    })
}

const getComics = ()=>{
    sendXMLRequest("GET",`${BASE_URL}comics?limit=14&offset=${randomNo()}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        resp.data.results.map((item)=>{
            parentComicCard.append(cards(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.title,item.id))
        })
        $comic_owl.owlCarousel(setting); 
    }).catch(err=>{
        console.log(err)
    })
}
const getCreators = ()=>{
    sendXMLRequest("GET",`${BASE_URL}creators?limit=10&offset=50&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
    }).catch(err=>{
        console.log(err)
    })
}


addEventListener('onload',getCharacters())
addEventListener('onload',getComics())