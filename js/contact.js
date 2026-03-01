// Contact Page Functionality

// Copy email to clipboard
function copyEmail(email, button) {
    navigator.clipboard.writeText(email).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Email: ' + email);
    });
}

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Reset error states
    [name, email, subject, message].forEach(field => {
        field.classList.remove('error');
        document.getElementById(field.id + 'Error').classList.remove('show');
    });
    
    // Validate name
    if (name.value.trim() === '') {
        name.classList.add('error');
        document.getElementById('nameError').classList.add('show');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }
    
    // Validate subject
    if (subject.value.trim() === '') {
        subject.classList.add('error');
        document.getElementById('subjectError').classList.add('show');
        isValid = false;
    }
    
    // Validate message
    if (message.value.trim() === '') {
        message.classList.add('error');
        document.getElementById('messageError').classList.add('show');
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const submitBtn = document.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');
    const form = document.getElementById('contactForm');
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        successMessage.classList.add('show');
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            successMessage.classList.remove('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }, 3000);
    }, 1500);
}

// Real-time validation on input
function initRealTimeValidation() {
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    email.addEventListener('blur', () => {
        if (email.value.trim() !== '' && !emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            document.getElementById('emailError').classList.add('show');
        } else {
            email.classList.remove('error');
            document.getElementById('emailError').classList.remove('show');
        }
    });
    
    // Remove error on input
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.remove('error');
                document.getElementById(input.id + 'Error').classList.remove('show');
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initRealTimeValidation();
    
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', handleFormSubmit);
});
