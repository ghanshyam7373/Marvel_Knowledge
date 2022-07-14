import { APIKEY,PRIVATEKEY } from "./key.js"
const privateKey = PRIVATEKEY
const apiKey= APIKEY
const timeStamp = new Date().getTime()

const BASE_URL="https://gateway.marvel.com:443/v1/public/"
const hash =(privateKey,apiKey)=>{ return  CryptoJS.MD5(`${timeStamp}${privateKey}${apiKey}`)}
console.log(hash().toString());

const parentDiv = document.getElementById('results');

const resultrow = (imgUrl,charName,type)=>{
   const childCard = document.createElement('div')
   const col1 = document.createElement('div')
   const result_img = document.createElement('div')
   const image = document.createElement('img')
   const col2 = document.createElement('div')  
   const result_details = document.createElement('div')
   const result_type = document.createElement('p')
   const result_title = document.createElement('h4')
   const hr = document.createElement('hr')
   image.setAttribute('src',imgUrl);
   result_title.innerHTML = charName;
   result_type.innerHTML = type;

   childCard.classList.add('row')
   col1.classList.add('col-sm-2')
   result_img.classList.add('result_img')
   col2.classList.add('col-sm-6')
   result_details.classList.add('result_details')
   result_type.classList.add('result_type')
   result_title.classList.add('result_title')

   result_img.appendChild(image);
   col1.appendChild(result_img);
   result_details.appendChild(result_type);
   result_details.appendChild(result_title);
   col2.appendChild(result_details);
   childCard.appendChild(col1);
   childCard.appendChild(col2);
   childCard.appendChild(hr);

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
var flag =[]
const getDetails = () =>{
    
    const searchIp = document.getElementById('searchIp').value;

    if (document.getElementById('all').className === 'options currentid'){
        parentDiv.innerHTML = '';
    getCharacters(searchIp)
    getComics(searchIp)
    getCreators(searchIp)
    // if(flag[0]===1 && flag[1]===1 && flag[2]===1){
    //     var h4 = document.createElement('h4');
    //         h4.textContent="No Result Found";
    //         parentDiv.append(h4);
    // }
}

    else if (document.getElementById('characters').className === 'options currentid'){
        parentDiv.innerHTML = '';
        getCharacters(searchIp)}
    else if (document.getElementById('comics').className === 'options currentid'){
        parentDiv.innerHTML = '';
        getComics(searchIp)}
    else{
        parentDiv.innerHTML = '';
        getCreators(searchIp)}

}

    // characters
const getCharacters = (searchIp) =>{
    sendXMLRequest("GET",`${BASE_URL}characters?nameStartsWith=${searchIp}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        if(resp.data.results.length===0){
            flag.push(1)
        }
        else{
            flag.push(0)
        }
        resp.data.results.map((item)=>{
            parentDiv.append(resultrow(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.name,'character'))
        })
    }).catch(err=>{
        console.log(err)
    })
}
    // comics
const getComics = (searchIp) =>{
    sendXMLRequest("GET",`${BASE_URL}comics?title=${searchIp}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        if(resp.data.results.length===0){
            flag.push(1)
        }
        else{
        flag.push(0)}
        resp.data.results.map((item)=>{
            parentDiv.append(resultrow(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.title,'comic'))
        })
    }).catch(err=>{
        console.log(err)
    })
}    

    // creators
const getCreators = (searchIp) =>{
    sendXMLRequest("GET",`${BASE_URL}creators?firstName=${searchIp}&ts=${timeStamp}&apikey=${apiKey}&hash=${hash(privateKey,apiKey).toString()}`).then(resp=>{
        if(resp.data.results.length===0){
            flag.push(1)
        }
        else{
            flag.push(0)
        }
        resp.data.results.map((item)=>{
            parentDiv.append(resultrow(`${item.thumbnail.path}/portrait_uncanny.${item.thumbnail.extension}`,item.fullName,'creator'))
        })
    }).catch(err=>{
        console.log(err)
    })    
}

document.getElementById('searchIp').addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        getDetails();
    }
});
document.getElementById('searchicon').addEventListener('click',getDetails);

const setactive = (id) =>{
    switch (id) {
        case "all":
            document.getElementById('all').classList.add('currentid')
            document.getElementById('characters').classList.remove('currentid')
            document.getElementById('comics').classList.remove('currentid')
            document.getElementById('creators').classList.remove('currentid')
            break;
        case "characters":
            document.getElementById('all').classList.remove('currentid')
            document.getElementById('characters').classList.add('currentid')
            document.getElementById('comics').classList.remove('currentid')
            document.getElementById('creators').classList.remove('currentid')
            break;
        case "comics":
            document.getElementById('all').classList.remove('currentid')
            document.getElementById('characters').classList.remove('currentid')
            document.getElementById('comics').classList.add('currentid')
            document.getElementById('creators').classList.remove('currentid')
            break;
        case "creators":
            document.getElementById('all').classList.remove('currentid')
            document.getElementById('characters').classList.remove('currentid')
            document.getElementById('comics').classList.remove('currentid')
            document.getElementById('creators').classList.add('currentid')
            break;
    
        default:
            break;
    }

}
document.getElementById('all').addEventListener('click',()=>{
    setactive('all')
    getDetails()
})
document.getElementById('characters').addEventListener('click',()=>{
    setactive('characters')
    getDetails()
})
document.getElementById('comics').addEventListener('click',()=>{
    setactive('comics')
    getDetails()
})
document.getElementById('creators').addEventListener('click',()=>{
    setactive('creators')
    getDetails()
})
