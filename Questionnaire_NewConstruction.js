// Questionnaire functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qualification-form');
    const steps = document.querySelectorAll('.question-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressFill = document.getElementById('progress-fill');
    
    let currentStep = 0;
    const totalSteps = steps.length;

    // Update progress bar
    function updateProgress() {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        progressFill.style.width = progress + '%';
    }

    // Show current step
    function showStep(step) {
        steps.forEach((s, index) => {
            if (index === step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });

        // Update button visibility
        prevBtn.style.display = step === 0 ? 'none' : 'inline-block';
        nextBtn.style.display = step === totalSteps - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = step === totalSteps - 1 ? 'inline-block' : 'none';

        updateProgress();
    }

    // Validate current step
    function validateStep(step) {
        const currentStepElement = steps[step];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (field.type === 'radio' || field.type === 'checkbox') {
                const name = field.name;
                const checked = currentStepElement.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                    field.closest('.question-card').style.border = '2px solid #ff0000';
                } else {
                    field.closest('.question-card').style.border = '';
                }
            } else {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff0000';
                } else {
                    field.style.borderColor = '';
                }
            }
        });

        // Special validation for checkboxes (purpose question)
        if (step === 7) { // Purpose step
            const checked = currentStepElement.querySelectorAll('input[name="purpose"]:checked');
            if (checked.length === 0) {
                isValid = false;
                currentStepElement.querySelector('.question-card').style.border = '2px solid #ff0000';
            }
        }

        return isValid;
    }

    // Next button handler
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) {
                currentStep++;
                showStep(currentStep);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            alert('Please complete all required fields before proceeding.');
        }
    });

    // Previous button handler
    prevBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Auto-proceed functionality
    function setupAutoProceed() {
        // Handle radio buttons
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const stepElement = this.closest('.question-step');
                const stepIndex = Array.from(steps).indexOf(stepElement);
                
                if (stepIndex === currentStep && validateStep(currentStep)) {
                    // Small delay for better UX
                    setTimeout(() => {
                        if (currentStep < totalSteps - 1) {
                            currentStep++;
                            showStep(currentStep);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 300);
                }
            });
        });

        // Handle text inputs (address, lot size, contact info)
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
            input.addEventListener('blur', function() {
                const stepElement = this.closest('.question-step');
                const stepIndex = Array.from(steps).indexOf(stepElement);
                
                if (stepIndex === currentStep && this.value.trim() && validateStep(currentStep)) {
                    // Only auto-proceed for single-field questions (address, lot size)
                    if (stepIndex === 0 || stepIndex === 3) {
                        setTimeout(() => {
                            if (currentStep < totalSteps - 1) {
                                currentStep++;
                                showStep(currentStep);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }, 300);
                    }
                }
            });
        });

        // Handle checkboxes (purpose question) - don't auto-proceed, let user select multiple
    }

    // Handle "Other" option visibility
    document.querySelectorAll('input[type="radio"][value="Other"], input[type="checkbox"][value="Other"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const name = this.name;
            const otherInput = document.getElementById(name === 'funding' ? 'funding-other-input' : 'purpose-other-input');
            if (this.checked) {
                otherInput.classList.add('show');
                otherInput.setAttribute('required', 'required');
            } else {
                otherInput.classList.remove('show');
                otherInput.removeAttribute('required');
                otherInput.value = '';
            }
        });
    });

    // Initialize auto-proceed
    setupAutoProceed();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            alert('Please complete all required fields before submitting.');
            return;
        }

        // Collect all form data
        const formData = new FormData(form);
        const data = {};

        // Get all form values
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Handle checkboxes separately
        const purposeCheckboxes = form.querySelectorAll('input[name="purpose"]:checked');
        data.purpose = Array.from(purposeCheckboxes).map(cb => cb.value);

        // Build email body
        let emailBody = 'ADU Qualification Questionnaire Submission\n\n';
        emailBody += '=== PROPERTY INFORMATION ===\n';
        emailBody += `Primary Dwelling Address: ${data.address || 'N/A'}\n`;
        emailBody += `County: ${data.county || 'N/A'}\n`;
        emailBody += `Single Family Detached Home: ${data['single-family'] || 'N/A'}\n`;
        emailBody += `Lot Size: ${data['lot-size'] || 'N/A'}\n`;
        emailBody += `Site Plan Approval: ${data['site-plan-approval'] || 'N/A'}\n`;
        emailBody += `Utilities (Septic/Water): ${data.utilities || 'N/A'}\n\n`;

        emailBody += '=== PROJECT DETAILS ===\n';
        emailBody += `Funding: ${data.funding || 'N/A'}`;
        if (data.funding === 'Other' && data['funding-other-text']) {
            emailBody += ` (${data['funding-other-text']})`;
        }
        emailBody += '\n';
        emailBody += `Purpose: ${Array.isArray(data.purpose) ? data.purpose.join(', ') : data.purpose || 'N/A'}`;
        if (data.purpose && data.purpose.includes('Other') && data['purpose-other-text']) {
            emailBody += ` (${data['purpose-other-text']})`;
        }
        emailBody += '\n';
        emailBody += `Floor Plan: ${data['floor-plan'] || 'N/A'}\n\n`;

        emailBody += '=== CONTACT INFORMATION ===\n';
        emailBody += `Name: ${data['contact-name'] || 'N/A'}\n`;
        emailBody += `Email: ${data['contact-email'] || 'N/A'}\n`;
        emailBody += `Phone: ${data['contact-phone'] || 'N/A'}\n\n`;

        emailBody += '---\n';
        emailBody += 'This submission was generated from the Nayalof Builders ADU Qualification Questionnaire.\n';
        emailBody += 'Please follow up with the homeowner to verify property details and proceed with qualification assessment.';

        // Create mailto link
        const subject = encodeURIComponent('ADU Qualification Questionnaire Submission');
        const body = encodeURIComponent(emailBody);
        const email = 'NayalofBuilders@gmail.com';
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        setTimeout(function() {
            alert('Thank you for completing the questionnaire! Your email client should open with a pre-filled message. Please review and send the email to submit your information.\n\nIf your email client did not open, please email NayalofBuilders@gmail.com with the information you provided.');
            
            // Optionally redirect or show a thank you message
            const thankYouMessage = document.createElement('div');
            thankYouMessage.style.cssText = 'background: var(--secondary-green-light); color: var(--secondary-green); padding: var(--spacing-lg); border-radius: var(--radius-lg); text-align: center; margin-top: var(--spacing-lg);';
            thankYouMessage.innerHTML = '<h2 style="color: var(--secondary-green); margin-bottom: var(--spacing-sm);">Thank You!</h2><p>We have received your questionnaire submission. Our team will review your information and contact you soon.</p><a href="index.html" class="btn btn-primary" style="margin-top: var(--spacing-md);">Return to Home</a>';
            form.parentElement.appendChild(thankYouMessage);
            form.style.display = 'none';
        }, 500);
    });

    // Initialize
    showStep(0);
});
