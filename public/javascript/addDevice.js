let addImgBtn = document.querySelector(".addImg");
let modalForm = document.getElementById("addImgModal");
addImgBtn.addEventListener('click', () => {
    // display modal
    modalForm.style.display = 'flex';
});


//display Image
/*let saveBtnImg = document.getElementById("saveImg");
saveBtnImg.addEventListener('click', function(){
    var fileName = document.getElementById('imgFile');
    var btnText = document.getElementById('btnText');
    // save img to local storage
    console.log('input type ' + typeof(fileName.value))
    const reader = new FileReader();
    reader.addEventListener('load', _ =>{
        imgSRC = reader.result;
        // create background image
        addImgBtn.style.backgroundImage = 'url('+imgSRC+')';
        addImgBtn.style.width = '400px';
        addImgBtn.style.height = '400px';
        addImgBtn.style.backgroundSize = '400px 400px';
        modalForm.style.display = 'none';
        btnText.style.display = 'none';
        //console.log(imgSRC)
        let data = JSON.stringify({
            img: imgSRC
        })
        console.log('json type ' + typeof(data))
        fetch('/img', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: data
        })
            .then(res => {
                if(res.ok) return res.json()
                ///alert('post')
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => console.error(error))
    });
    reader.readAsDataURL(fileName.files[0]);
    //reader.readAsText(fileName.files[0]);
});*/


let closeBtn = document.querySelector('#closeModal');
closeBtn.addEventListener('click', ()=>{
    modalForm.style.display = 'none';
});

let addDevBtn = document.getElementById('addDevice');
let addDevModal = document.getElementById("addDev");
addDevBtn.addEventListener('click', () => {
    addDevModal.style.display = 'flex';
});

let closeDevBtn = document.querySelector('#closeDevModal');
closeDevBtn.addEventListener('click', ()=>{
    addDevModal.style.display = 'none';
});

// when save is clicked, save input values
/*let saveDevBtn = document.getElementById("saveDevModal");
let inputID = ['devId', 'devLoc','devTyp','life','meter','dateInstall','stat','inspStat'];
//console.log(inputID.length);
saveDevBtn.addEventListener('click', ()=>{
    for (var indx = 0; indx < inputID.length; indx++){
        inputVal = document.getElementById(inputID[indx]).value;
        localStorage.setItem(inputID[indx], inputVal);
    }
    // close modal
    addDevModal.style.display = 'none';
    
    // clear input values
    for (var indx = 0; indx < inputID.length; indx++){
        inputVal = document.getElementById(inputID[indx]);
        inputVal.value = '';
    }

    // display localstorage item to table
    // add table row
    var mainTbl = document.getElementById('devTbl');
    tblRow = document.getElementsByTagName('tr');
    // create table data
    // data from local storage
    row = mainTbl.insertRow(tblRow.length);
    
    for (var indx = 0; indx < inputID.length; indx++){
        row.insertCell(indx).innerHTML = localStorage.getItem(inputID[indx]);        
    }
    row.insertCell(inputID.length).innerHTML = '<a href="">Edit</a><a href="">Delete</a>';
    
    
});*/

const devIDEdit = document.querySelector('#devIDEdit');
const devLocEdit = document.querySelector('#devLocEdit');
const devTypEdit = document.querySelector('#devTypEdit');
const lifeEdit = document.querySelector('#lifeEdit');
const dateInstallEdit = document.querySelector('#dateInstallEdit');
const timeInstallEdit = document.querySelector('#timeInstallEdit');
const statEdit = document.querySelector('#statEdit');
const inspStatEdit = document.querySelector('#inspStatEdit');

const modalEdit = document.querySelector('.modalFormEdit')
const saveEdit =document.querySelector('#saveEdit')
var editableID, editableDevLoc, editableDevTyp, editableLife, editableDateInstall, editableTimeInstall, editableStat, editableInspStat
function edit(devId,devLoc,devTyp,life,dateInstall,timeInstall,stat,inspStat){
    //console.log(id + name)
    modalEdit.style.display = 'flex'

    devIDEdit.value = devId
    devLocEdit.value = devLoc
    devTypEdit.value = devTyp
    lifeEdit.value = life
    dateInstallEdit.value = dateInstall
    timeInstallEdit.value = timeInstall
    statEdit.value = stat
    inspStatEdit.value = inspStat

}

const closeEditBtn = document.querySelector('#closeDevModalEdit')
closeEditBtn.addEventListener('click', () => {
    modalEdit.style.display = 'none'
})


const buildNameEdit = document.querySelector("#buildNameEdit")
const floorIDEdit = document.querySelector("#floorIDEdit")
const roomIDEdit = document.querySelector("#roomIDEdit")
const saveEditBtn = document.querySelector('#saveDevModalEdit')
saveEditBtn.addEventListener('click', e => {
    e.preventDefault()
    fetch('/device', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            devId: devIDEdit.value, 
            devLoc: devLocEdit.value, 
            devTyp: devTypEdit.value, 
            life: lifeEdit.value, 
            dateInstall:  dateInstallEdit.value, 
            timeInstall: timeInstallEdit.value , 
            stat: statEdit.value, 
            inspStat: inspStatEdit.value,
            buildName: buildNameEdit.value,
            floorID: floorIDEdit.value,
            roomID: roomIDEdit.value
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            console.log(response)
            window.location.reload(true)
        })
})

function deleteRow(id){
    //alert(id)
    fetch('/device', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            devId: id
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            window.location.reload(true)
        })
        .catch(error => console.error(error))
}

// save added Device
const saveBtn = document.querySelector("#saveDevModal")
const buildName = document.querySelector("#buildName")
const floorID = document.querySelector("#floorID")
const roomID = document.querySelector("#roomID")
const devId = document.querySelector("#devId")
const devLoc = document.querySelector("#devLoc")
const devTyp = document.querySelector("#devTyp")
const life = document.querySelector("#life")
const dateInstall = document.querySelector("#dateInstall")
const timeInstall = document.querySelector("#timeInstall")
const stat = document.querySelector("#stat")
const inspStat = document.querySelector("#inspStat")
saveBtn.addEventListener("click", e => {
    e.preventDefault()
    fetch('/device', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            buildName: buildName.value,
            floorID: floorID.value,
            roomID: roomID.value,
            devId: devId.value,
            devLoc: devLoc.value,
            devTyp: devTyp.value,
            life: life.value,
            dateInstall: dateInstall.value,
            timeInstall: timeInstall.value,
            stat: stat.value,
            inspStat: inspStat.value
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            console.log(response)
            window.location.reload(true)
        })
})
