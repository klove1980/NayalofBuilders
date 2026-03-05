// Shed page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Monthly payment calculation factor (10 years @ 10% APR)
    const MONTHLY_PAYMENT_FACTOR = 0.013215;
    
    // Function to calculate monthly payment
    function calculateMonthlyPayment(price) {
        return Math.round(price * MONTHLY_PAYMENT_FACTOR);
    }
    
    // Function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toLocaleString();
    }
    
    // Handle size selection for each shed model
    const shedSelectors = [
        { selector: '#lancaster-size', details: '#lancaster-details', priceEl: '#lancaster-price', monthlyEl: '#lancaster-monthly' },
        { selector: '#coronado-size', details: '#coronado-details', priceEl: '#coronado-price', monthlyEl: '#coronado-monthly' },
        { selector: '#monterra-size', details: '#monterra-details', priceEl: '#monterra-price', monthlyEl: '#monterra-monthly' },
        { selector: '#littlecottage-size', details: '#littlecottage-details', priceEl: '#littlecottage-price', monthlyEl: '#littlecottage-monthly' },
        { selector: '#estate-size', details: '#estate-details', priceEl: '#estate-price', monthlyEl: '#estate-monthly' }
    ];
    
    shedSelectors.forEach(function(config) {
        const select = document.querySelector(config.selector);
        const details = document.querySelector(config.details);
        const priceEl = document.querySelector(config.priceEl);
        const monthlyEl = document.querySelector(config.monthlyEl);
        
        if (select && details && priceEl && monthlyEl) {
            select.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const price = selectedOption.getAttribute('data-price');
                
                if (price) {
                    const priceNum = parseInt(price);
                    const monthly = calculateMonthlyPayment(priceNum);
                    
                    // Update display
                    priceEl.textContent = formatCurrency(priceNum);
                    monthlyEl.textContent = formatCurrency(monthly) + '/mo';
                    
                    // Show details
                    details.style.display = 'block';
                    
                    // Smooth scroll to details
                    setTimeout(function() {
                        details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    // Hide details if no size selected
                    details.style.display = 'none';
                }
            });
        }
    });
});
