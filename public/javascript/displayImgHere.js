const imgFile = document.querySelector("#imgFile")
const imgDiv = document.querySelector("#imgDiv")
imgDiv.addEventListener('click', _ => {
    console.log(imgFile.value)
    //obj = JSON.parse("{"+imgFile.value+"}")
    //console.log(obj)
    //console.log("typeof img from database " + typeof(imgFile.value))
    //JSON.parse(imgFile.value)
    //console.log("imgFile.files[0] = " + imgFile.files[0])
    /*imgDiv.style.backgroundImage = 'url('+imgFile.value+')';
    imgDiv.style.width = '400px';
    imgDiv.style.height = '400px';
    imgDiv.style.backgroundSize = '400px 400px';
    /*const reader = new FileReader();
    reader.addEventListener('load', _ =>{
        imgSRC = reader.result;
        console.log("typeof img from input " + typeof(imgSRC))
        // create background image
        /*imgDiv.style.backgroundImage = 'url('+imgSRC+')';
        imgDiv.style.width = '400px';
        imgDiv.style.height = '400px';
        imgDiv.style.backgroundSize = '400px 400px';
    });
    reader.readAsDataURL(imgFile.files[0]);*/
    
})