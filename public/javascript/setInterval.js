setInterval(() => {
    content = document.querySelector('.notifContent')
    temp = content.innerHTML
    content.innerHTML = temp
}, 1000)

const notif = document.querySelector('.notif')
const notifContent = document.querySelector('.notifContent')
notif.addEventListener('click', ()=> {
    if(notifContent.style.display == 'none')
    {
        notifContent.style.display = 'block'
    }
    else
    {
        notifContent.style.display = 'none'
    }
})