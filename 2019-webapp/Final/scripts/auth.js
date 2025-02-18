db.collection('story').onSnapshot(snapshot => {
    storyData(snapshot.docs)
})

var nameForForm = ''

auth.onAuthStateChanged(user => {
    if (user) {
        nameForForm = user.email
        console.log(nameForForm)
        db.collection('story').onSnapshot(snapshot => {
            setupGuides(snapshot.docs)
            setupUI(user)
        }, err => {
            console.log(err.message)
        })

    } else {
        setupGuides([])
        setupUI()
    }

})





// create new guide 
const createForm = document.querySelector("#create-form")
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection("story").add({
        title: createForm['title'].value,
        content: createForm['content'].value,
        image: createForm['ref'].value,
        user: nameForForm
    }).then(() => {
        // close the modal
        const modal = document.querySelector("#modal-create")
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(err => {
        console.log(err.message)
    })

})


// signup
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
        // get user info

    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value
    const repassword = signupForm['signup-repassword'].value

    if (password === repassword) {
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            const modal = document.querySelector("#modal-signup")
            M.Modal.getInstance(modal).close();
            signupForm.reset();
            signupForm.querySelector('.error').textContent = ""

        }).catch(err => {
            signupForm.querySelector('.error').textContent = err.message
        })
    } else {
        signupForm.querySelector('.error').textContent = "Please enter same password!"
    }

})

// logout
const logout = document.querySelector('#logout')
logout.addEventListener('click', (e) => {
    e.preventDefault()
    auth.signOut()
})


// login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
        // get user info

    const email = loginForm['login-email'].value
    const password = loginForm['login-password'].value


    auth.signInWithEmailAndPassword(email, password).then(cred => {

        const modal = document.querySelector("#modal-login")
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').textContent = ""
    }).catch(err => {
        loginForm.querySelector('.error').textContent = err.message
    })
})