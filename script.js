function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

document.addEventListener('DOMContentLoaded', function() {
    function handleFormSubmit(event) {
        event.preventDefault();
        console.log('Event target:', event.target);
        console.log('Event target tagName:', event.target.tagName);
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmit);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleFormSubmit);
    }
});
