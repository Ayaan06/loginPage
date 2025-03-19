function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    function handleFormSubmit(form, event) {
        event.preventDefault();
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

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            handleFormSubmit(this, e);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            handleFormSubmit(this, e);
        });
    }
});
