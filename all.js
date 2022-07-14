import { APIKEY,PRIVATEKEY } from "./key.js"
const privateKey = PRIVATEKEY
const apiKey= APIKEY
const timeStamp = new Date().getTime()

const BASE_URL="https://gateway.marvel.com:443/v1/public/"
const hash =(privateKey,apiKey)=>{ return  CryptoJS.MD5(`${timeStamp}${privateKey}${apiKey}`)}
console.log(hash().toString());

const randomCharNo= ()=>{
    return Math.floor(Math.random()*2000)
}
const randomComicNo= ()=>{
    return Math.floor(Math.random()*27000)
}
const randomCreNo= ()=>{
    return Math.floor(Math.random()*1000)
}
var character = document.getElementById('character');
var comic = document.getElementById('comic');
var creator = document.getElementById('creator');

const parentCharacterCard = document.getElementById('characters_card');
const parentComicCard = document.getElementById('comics_card');
const parentCreatorCard = document.getElementById('creators_card');

const cards = (imgUrl,charName)=>{
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
    sendXMLRequest("GET",`${BASE_URL}characters?limit=70&offset=${randomCharNo()}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        resp.data.results.map((item)=>{
            parentCharacterCard.append(cards(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.name))
        })
    }).catch(err=>{
        console.log(err)
    })
}

const getComics = ()=>{
    sendXMLRequest("GET",`${BASE_URL}comics?limit=70&offset=${randomComicNo()}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        resp.data.results.map((item)=>{
            parentComicCard.append(cards(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.title))
        })
    }).catch(err=>{
        console.log(err)
    })
}

const getCreators = ()=>{
    sendXMLRequest("GET",`${BASE_URL}creators?limit=70&offset=${randomCreNo()}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        resp.data.results.map((item)=>{
            parentCreatorCard.append(cards(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,`${item.firstName} ${item.lastName}`))
        })
    }).catch(err=>{
        console.log(err)
    })
}

if(comic){
comic.addEventListener('onload',getComics())}
if(character){
character.addEventListener('onload',getCharacters())}
if(creator){
creator.addEventListener('onload',getCreators())}

// switch()