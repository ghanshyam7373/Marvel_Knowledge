const privateKey = '1fdc7c01b12cf092c6cd44238c94cc728ab7d9c2'
const apiKey= '7514ef1d59cb5ef96f7a8bc5a3aaac8a'
const timeStamp = new Date().getTime()

const BASE_URL="https://gateway.marvel.com:443/v1/public/"
const hash =(privateKey,apiKey)=>{ return  CryptoJS.MD5(`${timeStamp}${privateKey}${apiKey}`)}
console.log(hash().toString());
window.location.href = "chardetail.html";


const parentCharacterCard = document.getElementById('characters_card');

const cards = (imgUrl)=>{
    const childCard = document.createElement('div')
    const image = document.createElement('img')
    image.setAttribute('src',imgUrl);
 
    childCard.classList.add('custom-card')
    image.classList.add('custom-card-image')
 
    childCard.appendChild(image);
 
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

const getCharacterDetail = (id)=>{
    sendXMLRequest("GET",`${BASE_URL}characters?id=${id}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        resp.data.results.map((item)=>{
            parentCharacterCard.append(cards(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`))
        // console.log(resp)
        })
    }).catch(err=>{
        console.log(err)
    })
}
