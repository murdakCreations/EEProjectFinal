const addFloorBtn = document.querySelector('#addFloor')
const modal = document.querySelector('.modalForm')
addFloorBtn.addEventListener('click', () => {
    modal.style.display = 'flex'
})

const closeBtn = document.querySelector('#close')
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
})

function hovered(id) {
    document.querySelector("#" + id).style.backgroundColor = 'grey'
    document.querySelector("#" + id + " .floorBtns").style.display = 'flex'
}

function left(id) {
    document.querySelector("#" + id).style.backgroundColor = 'white'
    document.querySelector("#" + id + " .floorBtns").style.display = 'none'
}

const floorNameVal = document.querySelector('#floorName')
const floorIDVal = document.querySelector('#floorID')

floorNameVal.addEventListener('change', () => {
    id = floorNameVal.value.replace(/\s/g, "")
    floorIDVal.value = id
})


function currFloor(floor) {
    console.log(floor)
    floorIDVal.value = floor
    if (floorIDVal.value == floor) location ='/room'
}

const idEditInput = document.getElementById('floorIDEdit')
const nameEditInput = document.getElementById('floorNameEdit')
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
    fetch('/floor', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            floorID: editableID,
            floorName: nameEditInput.value
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
    fetch('/floor', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            floorID: id
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            window.location.reload()
        })
}

// save added floor
const saveBtn = document.querySelector("#save")
const buildName = document.querySelector("#buildName")
saveBtn.addEventListener("click", e => {
    e.preventDefault()
    fetch('/floor', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            floorID: floorIDVal.value,
            floorName: floorNameVal.value,
            buildName: buildName.value
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