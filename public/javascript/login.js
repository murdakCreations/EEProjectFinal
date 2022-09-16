const loginBtn = document.querySelector('#enterBuildID')
const loginInput = document.querySelector('#loginID')
const message = document.querySelector('#message')
loginBtn.addEventListener('click', _ => {
    console.log(loginInput.value)
    fetch('/buildIn', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            loginID: 'awer'
        })
    })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(response => {
            alert('responded')
            if(response === 'ID not found') {
                messageDiv.textContent = 'ID not found'
            } else {
                window.location.reload(true)
            }
        })
        .catch(error => console.error(error))
})