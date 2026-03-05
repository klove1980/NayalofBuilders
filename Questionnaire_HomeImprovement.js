// Home Improvement Questionnaire functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('home-improvement-form');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressFill = document.getElementById('progress-fill');
    
    // Shed pricing data
    const shedPricing = {
        'Lancaster': {
            '10x10': 4799,
            '12x10': 6599,
            '12x12': 7599,
            '16x10': 7799,
            '16x12': 9199,
            '20x12': 9999,
            '24x12': 11599
        },
        'Coronado': {
            '12x8': 4799
        },
        'Monterra': {
            '10x10': 4099,
            '10x12': 4399,
            '10x16': 5399
        },
        'Little Cottage': {
            '12x12': 6299,
            '12x14': 6899,
            '12x16': 7499,
            '12x20': 8499
        },
        'Estate': {
            '10x10': 5799,
            '10x12': 6999,
            '12x12': 8199,
            '12x16': 9399,
            '12x20': 10600
        }
    };
    
    // ADU pricing data
    const aduPricing = {
        'The Sprout': { sqft: 700, price: 129900 },
        'The Charmer': { sqft: 800, price: 144900 },
        'The Nook': { sqft: 900, price: 159900 },
        'The Nest': { sqft: 950, price: 167900 },
        'The Haven': { sqft: 1000, price: 174900 }
    };
    
    // Monthly payment calculation factor (10 years @ 10% APR)
    const MONTHLY_PAYMENT_FACTOR = 0.013215;
    
    let currentStep = 0;
    let projectType = null; // 'adu', 'shed', 'batting', or 'renovation'
    let activeSteps = []; // Array of step indices that are active for current project type
    
    // Get all step elements
    const step1ProjectType = document.querySelector('[data-step="1"]');
    const step2RenovationType = document.getElementById('renovation-type-step');
    const step2ShedSelection = document.getElementById('shed-selection-step');
    const step2BattingSelection = document.getElementById('batting-selection-step');
    const step2AduSelection = document.getElementById('adu-selection-step');
    const step3Timeline = document.getElementById('timeline-step');
    const step3Budget = document.getElementById('budget-step');
    const step4Contact = document.getElementById('contact-step');
    
    // Initialize active steps array
    function initializeSteps() {
        activeSteps = [0]; // Step 1 (project type) is always first
    }
    
    // Update active steps based on project type
    function updateActiveSteps() {
        activeSteps = [0]; // Step 1: Project Type
        
        if (projectType === 'adu') {
            activeSteps.push(1); // Step 2: ADU Selection
            activeSteps.push(2); // Step 3: Timeline
            activeSteps.push(3); // Step 4: Contact
        } else if (projectType === 'shed') {
            activeSteps.push(1); // Step 2: Shed Selection
            activeSteps.push(2); // Step 3: Timeline
            activeSteps.push(3); // Step 4: Contact
        } else if (projectType === 'batting') {
            activeSteps.push(1); // Step 2: Batting Cage Selection
            activeSteps.push(2); // Step 3: Timeline
            activeSteps.push(3); // Step 4: Contact
        } else if (projectType === 'renovation') {
            activeSteps.push(1); // Step 2: Renovation Type
            activeSteps.push(2); // Step 3: Timeline
            activeSteps.push(3); // Step 4: Budget
            activeSteps.push(4); // Step 5: Contact
        }
    }
    
    // Get current active step element
    function getCurrentStepElement() {
        if (activeSteps.length === 0 || currentStep >= activeSteps.length) return null;
        
        if (currentStep === 0) return step1ProjectType;
        if (projectType === 'adu') {
            if (currentStep === 1) return step2AduSelection;
            if (currentStep === 2) return step3Timeline;
            if (currentStep === 3) return step4Contact;
        } else if (projectType === 'shed') {
            if (currentStep === 1) return step2ShedSelection;
            if (currentStep === 2) return step3Timeline;
            if (currentStep === 3) return step4Contact;
        } else if (projectType === 'batting') {
            if (currentStep === 1) return step2BattingSelection;
            if (currentStep === 2) return step3Timeline;
            if (currentStep === 3) return step4Contact;
        } else if (projectType === 'renovation') {
            if (currentStep === 1) return step2RenovationType;
            if (currentStep === 2) return step3Timeline;
            if (currentStep === 3) return step3Budget;
            if (currentStep === 4) return step4Contact;
        }
        return null;
    }
    
    // Update progress bar
    function updateProgress() {
        const progress = ((currentStep + 1) / activeSteps.length) * 100;
        progressFill.style.width = progress + '%';
    }
    
    // Show current step
    function showStep(step) {
        // Hide all steps
        [step1ProjectType, step2RenovationType, step2ShedSelection, step2BattingSelection, step2AduSelection, step3Timeline, step3Budget, step4Contact].forEach(s => {
            if (s) {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });
        
        // Show current step
        const currentStepElement = getCurrentStepElement();
        if (currentStepElement) {
            // Sync batting price display when showing batting selection step
            if (currentStepElement.id === 'batting-selection-step') {
                const bp = document.getElementById('batting-package');
                if (bp && bp.value) bp.dispatchEvent(new Event('change'));
            }
            currentStepElement.classList.add('active');
            currentStepElement.style.display = 'block';
        }
        
        // Update button visibility
        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        const isLastStep = currentStep === activeSteps.length - 1;
        nextBtn.style.display = isLastStep ? 'none' : 'inline-block';
        submitBtn.style.display = isLastStep ? 'inline-block' : 'none';
        
        // Update step titles dynamically
        const timelineTitle = document.getElementById('timeline-step-title');
        const budgetTitle = document.getElementById('budget-step-title');
        const contactTitle = document.getElementById('contact-step-title');
        
        if (projectType === 'adu') {
            if (timelineTitle) timelineTitle.textContent = 'Step 3: Project Timeline';
            if (contactTitle) contactTitle.textContent = 'Step 4: Contact Information';
        } else if (projectType === 'batting') {
            if (timelineTitle) timelineTitle.textContent = 'Step 3: Project Timeline';
            if (contactTitle) contactTitle.textContent = 'Step 4: Contact Information';
        } else if (projectType === 'shed') {
            if (timelineTitle) timelineTitle.textContent = 'Step 3: Project Timeline';
            if (contactTitle) contactTitle.textContent = 'Step 4: Contact Information';
        } else if (projectType === 'renovation') {
            if (timelineTitle) timelineTitle.textContent = 'Step 3: Project Timeline';
            if (budgetTitle) budgetTitle.textContent = 'Step 4: Estimated Budget';
            if (contactTitle) contactTitle.textContent = 'Step 5: Contact Information';
        }
        
        updateProgress();
    }
    
    // Validate current step
    function validateStep(step) {
        const currentStepElement = getCurrentStepElement();
        if (!currentStepElement) return false;
        
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (field.type === 'radio' || field.type === 'checkbox') {
                const name = field.name;
                const checked = currentStepElement.querySelector(`input[name="${name}"]:checked`);
                if (!checked) {
                    isValid = false;
                    const card = field.closest('.question-card');
                    if (card) card.style.border = '2px solid #ff0000';
                } else {
                    const card = field.closest('.question-card');
                    if (card) card.style.border = '';
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
        
        // Special validation for renovation type checkboxes
        if (projectType === 'renovation' && step === 1) {
            const checked = currentStepElement.querySelectorAll('input[name="renovation-type"]:checked');
            if (checked.length === 0) {
                isValid = false;
                const card = currentStepElement.querySelector('.question-card');
                if (card) card.style.border = '2px solid #ff0000';
            } else {
                const card = currentStepElement.querySelector('.question-card');
                if (card) card.style.border = '';
            }
            
            // Validate "Other" option if selected
            const otherSelected = currentStepElement.querySelector('input[name="renovation-type"][value="Other"]:checked');
            const otherInput = document.getElementById('renovation-other-input');
            if (otherSelected && otherInput && !otherInput.value.trim()) {
                isValid = false;
                otherInput.style.borderColor = '#ff0000';
            } else if (otherInput) {
                otherInput.style.borderColor = '';
            }
        }
        
        // Special validation for shed selection
        if (projectType === 'shed' && step === 1) {
            const shedStyle = document.getElementById('shed-style');
            const shedSize = document.getElementById('shed-size');
            if (!shedStyle || !shedStyle.value) {
                isValid = false;
                if (shedStyle) shedStyle.style.borderColor = '#ff0000';
            } else if (shedStyle) {
                shedStyle.style.borderColor = '';
            }
            if (!shedSize || !shedSize.value) {
                isValid = false;
                if (shedSize) shedSize.style.borderColor = '#ff0000';
            } else if (shedSize) {
                shedSize.style.borderColor = '';
            }
        }
        
        // Special validation for batting cage selection
        if (projectType === 'batting' && step === 1) {
            const battingPackage = document.getElementById('batting-package');
            if (!battingPackage || !battingPackage.value) {
                isValid = false;
                if (battingPackage) battingPackage.style.borderColor = '#ff0000';
            } else if (battingPackage) {
                battingPackage.style.borderColor = '';
            }
        }
        
        // Special validation for ADU selection
        if (projectType === 'adu' && step === 1) {
            const selectedAdu = currentStepElement.querySelector('input[name="adu-plan"]:checked');
            if (!selectedAdu) {
                isValid = false;
                const cards = currentStepElement.querySelectorAll('.adu-option-card');
                cards.forEach(card => {
                    card.style.border = '2px solid #ff0000';
                });
            } else {
                const cards = currentStepElement.querySelectorAll('.adu-option-card');
                cards.forEach(card => {
                    card.style.border = '2px solid var(--border-color)';
                });
            }
        }
        
        return isValid;
    }
    
    // Next button handler
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < activeSteps.length - 1) {
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
    
    // Handle project type selection
    document.querySelectorAll('input[name="project-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            projectType = this.value;
            updateActiveSteps();
            currentStep = 1;
            showStep(currentStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Handle shed style selection
    const shedStyleSelect = document.getElementById('shed-style');
    const shedSizeSelect = document.getElementById('shed-size');
    
    if (shedStyleSelect) {
        shedStyleSelect.addEventListener('change', function() {
            const style = this.value;
            const sizes = shedPricing[style];
            
            // Clear and populate size options
            shedSizeSelect.innerHTML = '<option value="">Choose a size...</option>';
            if (sizes) {
                Object.keys(sizes).forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size.replace('x', '×');
                    option.setAttribute('data-price', sizes[size]);
                    shedSizeSelect.appendChild(option);
                });
            }
            
            // Reset price display
            document.getElementById('shed-price-display').style.display = 'none';
            shedSizeSelect.value = '';
        });
    }
    
    // Handle batting cage package selection and display price
    const battingPackageSelect = document.getElementById('batting-package');
    if (battingPackageSelect) {
        battingPackageSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const packagePrice = selectedOption.getAttribute('data-package');
            const installPrice = selectedOption.getAttribute('data-install');
            const priceDisplay = document.getElementById('batting-price-display');
            const packagePriceEl = document.getElementById('batting-package-price');
            const installPriceEl = document.getElementById('batting-install-price');
            
            if (packagePrice && installPrice) {
                packagePriceEl.textContent = '$' + parseInt(packagePrice).toLocaleString();
                installPriceEl.textContent = '$' + parseInt(installPrice).toLocaleString();
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        });
    }
    
    // Handle shed size selection and calculate price
    if (shedSizeSelect) {
        shedSizeSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            const priceDisplay = document.getElementById('shed-price-display');
            const cashPriceEl = document.getElementById('shed-cash-price');
            const monthlyPaymentEl = document.getElementById('shed-monthly-payment');
            
            if (price) {
                const priceNum = parseInt(price);
                const monthly = Math.round(priceNum * MONTHLY_PAYMENT_FACTOR);
                
                cashPriceEl.textContent = '$' + priceNum.toLocaleString();
                monthlyPaymentEl.textContent = '$' + monthly.toLocaleString() + '/mo';
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        });
    }
    
    // Handle Additional Information word limit (50 words) and countdown
    const additionalInfoTextarea = document.getElementById('additional-info');
    const additionalInfoCount = document.getElementById('additional-info-count');
    const ADDITIONAL_INFO_MAX_WORDS = 50;
    
    if (additionalInfoTextarea && additionalInfoCount) {
        function getWordCount(str) {
            return str.trim().split(/\s+/).filter(w => w.length > 0).length;
        }
        function updateAdditionalInfoCount() {
            const text = additionalInfoTextarea.value;
            const count = getWordCount(text);
            const remaining = Math.max(0, ADDITIONAL_INFO_MAX_WORDS - count);
            if (count >= ADDITIONAL_INFO_MAX_WORDS) {
                additionalInfoCount.textContent = count + ' / ' + ADDITIONAL_INFO_MAX_WORDS + ' words (limit reached)';
                additionalInfoCount.style.color = 'var(--secondary-green)';
            } else {
                additionalInfoCount.textContent = remaining + ' words remaining';
                additionalInfoCount.style.color = 'var(--text-gray)';
            }
        }
        additionalInfoTextarea.addEventListener('input', function() {
            const words = this.value.trim().split(/\s+/).filter(w => w.length > 0);
            if (words.length > ADDITIONAL_INFO_MAX_WORDS) {
                this.value = words.slice(0, ADDITIONAL_INFO_MAX_WORDS).join(' ');
            }
            updateAdditionalInfoCount();
        });
        additionalInfoTextarea.addEventListener('paste', function() {
            setTimeout(updateAdditionalInfoCount, 0);
        });
    }
    
    // Handle "Other" option visibility for renovations
    document.querySelectorAll('input[type="checkbox"][value="Other"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const otherInput = document.getElementById('renovation-other-input');
            if (otherInput) {
                if (this.checked) {
                    otherInput.classList.add('show');
                    otherInput.setAttribute('required', 'required');
                } else {
                    otherInput.classList.remove('show');
                    otherInput.removeAttribute('required');
                    otherInput.value = '';
                }
            }
        });
    });
    
    // Handle ADU card selection visual feedback
    document.querySelectorAll('.adu-option-card input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove selected class from all cards
            document.querySelectorAll('.adu-option-card').forEach(card => {
                card.classList.remove('selected');
                card.style.border = '2px solid var(--border-color)';
            });
            // Add selected class to current card
            const card = this.closest('.adu-option-card');
            if (card) {
                card.classList.add('selected');
                card.style.border = '3px solid var(--secondary-green)';
            }
        });
    });
    
    // Auto-proceed functionality
    function setupAutoProceed() {
        // Handle radio buttons (for timeline)
        document.querySelectorAll('input[type="radio"][name="timeline"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const stepElement = this.closest('.question-step');
                if (stepElement && validateStep(currentStep)) {
                    setTimeout(() => {
                        if (currentStep < activeSteps.length - 1) {
                            currentStep++;
                            showStep(currentStep);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 300);
                }
            });
        });
        
        // Handle budget radio buttons (for renovations)
        document.querySelectorAll('input[type="radio"][name="budget"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const stepElement = this.closest('.question-step');
                if (stepElement && validateStep(currentStep)) {
                    setTimeout(() => {
                        if (currentStep < activeSteps.length - 1) {
                            currentStep++;
                            showStep(currentStep);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 300);
                }
            });
        });
    }
    
    // Initialize auto-proceed
    setupAutoProceed();
    
    // Form submission handler function
    function handleFormSubmit(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('Form submit handler called');
        console.log('Current step:', currentStep);
        console.log('Project type:', projectType);
        
        // Ensure projectType is set from form data if not already set
        if (!projectType) {
            const projectTypeRadio = form.querySelector('input[name="project-type"]:checked');
            if (projectTypeRadio) {
                projectType = projectTypeRadio.value;
                updateActiveSteps();
            } else {
                alert('Please select a project type before submitting.');
                currentStep = 0;
                showStep(0);
                return;
            }
        }
        
        const isValid = validateStep(currentStep);
        console.log('Validation result:', isValid);
        
        if (!isValid) {
            alert('Please complete all required fields before submitting.');
            return;
        }
        
        // Collect all form data
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Build email body
        let emailBody = 'Home Improvement Questionnaire Submission\n\n';
        emailBody += '=== PROJECT INFORMATION ===\n';
        
        let projectTypeName = 'Unknown';
        if (projectType === 'adu') projectTypeName = 'Accessory Dwelling Unit (Granny-Flat)';
        else if (projectType === 'shed') projectTypeName = 'Shed Construction';
        else if (projectType === 'batting') projectTypeName = 'Batting Cage';
        else if (projectType === 'renovation') projectTypeName = 'Residential Renovations';
        
        emailBody += `Project Type: ${projectTypeName}\n`;
        
        if (projectType === 'adu') {
            const selectedAdu = data['adu-plan'];
            emailBody += `Selected Floor Plan: ${selectedAdu || 'N/A'}\n`;
            if (selectedAdu && aduPricing[selectedAdu]) {
                const aduInfo = aduPricing[selectedAdu];
                emailBody += `Square Footage: ${aduInfo.sqft} SF\n`;
                emailBody += `Starting Price: $${aduInfo.price.toLocaleString()}\n`;
            }
            emailBody += `Configuration: 2 Bedrooms, 1 Bathroom\n`;
        } else if (projectType === 'batting') {
            const battingPackageSelect = document.getElementById('batting-package');
            const selectedPackage = data['batting-package'];
            emailBody += `Batting Cage Package: ${selectedPackage || 'N/A'}\n`;
            if (battingPackageSelect && selectedPackage) {
                const opt = Array.from(battingPackageSelect.options).find(o => o.value === selectedPackage);
                if (opt) {
                    const pkg = opt.getAttribute('data-package');
                    const install = opt.getAttribute('data-install');
                    if (pkg) emailBody += `Package Cost (DIY): $${parseInt(pkg).toLocaleString()}\n`;
                    if (install) emailBody += `Professional Install (add-on): $${parseInt(install).toLocaleString()}\n`;
                }
            }
        } else if (projectType === 'shed') {
            emailBody += `Shed Style: ${data['shed-style'] || 'N/A'}\n`;
            emailBody += `Shed Size: ${data['shed-size'] || 'N/A'}\n`;
            const selectedSize = shedSizeSelect ? shedSizeSelect.options[shedSizeSelect.selectedIndex] : null;
            if (selectedSize && selectedSize.getAttribute('data-price')) {
                const price = parseInt(selectedSize.getAttribute('data-price'));
                const monthly = Math.round(price * MONTHLY_PAYMENT_FACTOR);
                emailBody += `Estimated Price: $${price.toLocaleString()}\n`;
                emailBody += `Monthly Payment (10 years @ 10% APR): $${monthly.toLocaleString()}/mo\n`;
            }
        } else if (projectType === 'renovation') {
            const renovationCheckboxes = form.querySelectorAll('input[name="renovation-type"]:checked');
            const renovationTypes = Array.from(renovationCheckboxes).map(cb => cb.value);
            emailBody += `Renovation Type(s): ${renovationTypes.length > 0 ? renovationTypes.join(', ') : 'N/A'}`;
            if (renovationTypes.includes('Other') && data['renovation-other-text']) {
                emailBody += ` (${data['renovation-other-text']})`;
            }
            emailBody += '\n';
            emailBody += `Estimated Budget: ${data.budget || 'N/A'}\n`;
        }
        
        emailBody += '\n=== TIMELINE INFORMATION ===\n';
        emailBody += `Timeline: ${data.timeline || 'N/A'}\n`;
        if (data['preferred-start-date']) {
            emailBody += `Preferred Start Date: ${data['preferred-start-date']}\n`;
        }
        if (data['desired-completion-date']) {
            emailBody += `Desired Completion Date: ${data['desired-completion-date']}\n`;
        }
        if (data['seasonal-preference']) {
            emailBody += `Seasonal Preference: ${data['seasonal-preference']}\n`;
        }
        
        emailBody += '\n=== CONTACT INFORMATION ===\n';
        emailBody += `Name: ${data['contact-name'] || 'N/A'}\n`;
        emailBody += `Email: ${data['contact-email'] || 'N/A'}\n`;
        emailBody += `Phone: ${data['contact-phone'] || 'N/A'}\n`;
        emailBody += `Preferred Contact Method: ${data['contact-method'] || 'Email'}\n`;
        emailBody += `Interested in Financing Info: ${data['financing-followup'] ? 'Yes' : 'No'}\n`;
        if (data['additional-info'] && data['additional-info'].trim()) {
            emailBody += `Additional Information: ${data['additional-info'].trim()}\n`;
        }
        emailBody += '\n';
        
        emailBody += '---\n';
        emailBody += 'This submission was generated from the Nayalof Builders Home Improvement Questionnaire.\n';
        emailBody += 'Please follow up with the homeowner to discuss project details and provide a quote.';
        
        // Create mailto link
        const subject = encodeURIComponent('Home Improvement Questionnaire Submission - ' + projectTypeName);
        const body = encodeURIComponent(emailBody);
        const email = 'NayalofBuilders@gmail.com';
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
        
        console.log('Mailto link created');
        
        // Open email client - use direct navigation (most reliable)
        // Some browsers may require user interaction, so we do this immediately
        try {
            window.location.href = mailtoLink;
            console.log('Mailto link triggered');
        } catch (error) {
            console.error('Error opening mailto link:', error);
            // Fallback: show alert with information
            alert('Unable to open email client. Please email NayalofBuilders@gmail.com with the following information:\n\n' + emailBody);
        }
        
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
    }
    
    // Add form submit event listener
    form.addEventListener('submit', handleFormSubmit);
    
    // Also add click handler to submit button as fallback
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Submit button clicked');
            // Call the submit handler directly
            handleFormSubmit(null);
        });
    }
    
    // Initialize
    initializeSteps();
    showStep(0);
});
