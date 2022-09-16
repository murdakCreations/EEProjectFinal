const addRoomBtn = document.querySelector('#addRoom')
const modal = document.querySelector('.modalForm')
addRoomBtn.addEventListener('click', () => {
    modal.style.display = 'flex'
})

const closeBtn = document.querySelector('#close')
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
})

function hovered(id) {
    document.querySelector("#" + id).style.backgroundColor = 'grey'
    document.querySelector("#" + id + " .roomBtns").style.display = 'flex'
}

function left(id) {
    document.querySelector("#" + id).style.backgroundColor = 'white'
    document.querySelector("#" + id + " .roomBtns").style.display = 'none'
}

const roomNameVal = document.querySelector('#roomName')
const roomIDVal = document.querySelector('#roomID')

roomNameVal.addEventListener('change', () => {
    id = roomNameVal.value.replace(/\s/g, "")
    roomIDVal.value = id
})

function currFloor(floor) {
    console.log(floor)
    roomIDVal.value = floor
    if (roomIDVal.value == floor) location ='/device'
}

const idEditInput = document.getElementById('roomIDEdit')
const nameEditInput = document.getElementById('roomNameEdit')
const modalEdit = document.querySelector('.modalFormEdit')
const saveEdit =document.querySelector('#saveEdit')
var editableID
var editableName
function edit(id, name){
    //console.log(id + name)
    modalEdit.style.display = 'flex'
    idEditInput.value = id
    nameEditInput.value = name
    editableID = id
    editableName = name
}

const closeEditBtn = document.querySelector('#closeEdit')
closeEditBtn.addEventListener('click', () => {
    modalEdit.style.display = 'none'
})

const saveEditBtn = document.querySelector('#saveEdit')
saveEditBtn.addEventListener('click', e => {
    e.preventDefault()
    fetch('/room', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            roomID: editableID,
            roomName: nameEditInput.value
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

function deleteFloor(id){
    fetch('/room', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            roomID: id
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            window.location.reload()
        })
}

// save added Room
const saveBtn = document.querySelector("#save")
const buildName = document.querySelector("#buildName")
const floorID = document.querySelector("#floorID")
saveBtn.addEventListener("click", e => {
    e.preventDefault()
    fetch('/room', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            roomID: roomIDVal.value,
            roomName: roomNameVal.value,
            buildName: buildName.value,
            floorID: floorID.value,
            img: ''
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