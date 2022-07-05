const privateKey = '1fdc7c01b12cf092c6cd44238c94cc728ab7d9c2'
const apiKey= '7514ef1d59cb5ef96f7a8bc5a3aaac8a'
const timeStamp = new Date().getTime()
var $character_owl = $("#characters_card");
var $comic_owl = $("#comics_card");

const setting = 
    {
        loop:true,
        margin:5,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:7
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
   const button = document.createElement('button')
   image.setAttribute('src',imgUrl);
   cardTitle.innerHTML = charName;
   button.innerHTML = "More";
//    button.addEventListener('onclick',getCharacterDetail(id))

   childCard.classList.add('custom-card')
   image.classList.add('custom-card-image')
   cardContent.classList.add('custom-card-content')
   cardTitle.classList.add('custom-card-title')
   button.classList.add('custom-card-btn')

   cardContent.appendChild(cardTitle);
   cardContent.appendChild(button);
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

// addEventListener('onload',getCharacters())
// addEventListener('onload',getComics())


getCharacters()
getComics()