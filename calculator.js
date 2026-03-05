// Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculator-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Update slider value displays
    const sizeSlider = document.getElementById('adu-size');
    const sizeValue = document.getElementById('adu-size-value');
    const rentalSlider = document.getElementById('rental-income');
    const rentalValue = document.getElementById('rental-income-value');
    const rateSlider = document.getElementById('interest-rate');
    const rateValue = document.getElementById('interest-rate-value');
    
    sizeSlider.addEventListener('input', function() {
        sizeValue.textContent = this.value;
        calculate();
    });
    
    rentalSlider.addEventListener('input', function() {
        rentalValue.textContent = '$' + parseInt(this.value).toLocaleString();
        calculate();
    });
    
    rateSlider.addEventListener('input', function() {
        rateValue.textContent = parseFloat(this.value).toFixed(2);
        calculate();
    });
    
    // Calculate on any input change
    inputs.forEach(input => {
        input.addEventListener('change', calculate);
        input.addEventListener('input', calculate);
    });
    
    // Initial calculation
    calculate();
    
    function calculate() {
        // Get input values
        const size = parseInt(document.getElementById('adu-size').value);
        const constructionType = document.getElementById('construction-type').value;
        const finishLevel = document.getElementById('finish-level').value;
        const county = document.getElementById('county').value;
        const rentalIncome = parseInt(document.getElementById('rental-income').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        
        // Calculate construction cost per sq ft
        let costPerSqFt = 180; // Standard default
        if (finishLevel === 'basic') costPerSqFt = 160;
        if (finishLevel === 'premium') costPerSqFt = 200;
        
        // Adjust for construction type
        if (constructionType === 'garage-conversion') {
            costPerSqFt *= 0.85; // 15% cheaper
        } else if (constructionType === 'attached-adu') {
            costPerSqFt *= 0.95; // 5% cheaper
        }
        
        // Calculate base construction cost
        let constructionCost = size * costPerSqFt;
        
        // Calculate permit fees based on county
        let permitFees = 3000; // Base
        const permitMultipliers = {
            'st-marys': 1.0,
            'calvert': 1.1,
            'charles': 1.0,
            'prince-georges': 1.3,
            'anne-arundel': 1.2,
            'other': 1.0
        };
        permitFees = permitFees * (permitMultipliers[county] || 1.0);
        permitFees = Math.round(permitFees);
        
        // Total project cost
        const totalCost = constructionCost + permitFees;
        
        // Calculate monthly payment (simple loan calculation)
        const monthlyRate = interestRate / 12;
        const numPayments = loanTerm * 12;
        const monthlyPayment = totalCost * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                              (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        // Calculate cash flow
        const cashFlow = rentalIncome - monthlyPayment;
        
        // Calculate annual income
        const annualIncome = rentalIncome * 12;
        
        // Calculate break-even (years to recover total cost from net income)
        const annualCashFlow = cashFlow * 12;
        const breakEvenYears = annualCashFlow > 0 ? totalCost / annualCashFlow : Infinity;
        
        // Calculate ROI
        const roi5yr = ((annualCashFlow * 5) - totalCost) / totalCost * 100;
        const roi10yr = ((annualCashFlow * 10) - totalCost) / totalCost * 100;
        const roi15yr = ((annualCashFlow * 15) - totalCost) / totalCost * 100;
        
        // Update display
        document.getElementById('construction-cost').textContent = '$' + Math.round(constructionCost).toLocaleString();
        document.getElementById('permit-fees').textContent = '$' + Math.round(permitFees).toLocaleString();
        document.getElementById('total-cost').textContent = '$' + Math.round(totalCost).toLocaleString();
        document.getElementById('monthly-payment').textContent = '$' + Math.round(monthlyPayment).toLocaleString();
        document.getElementById('monthly-rental').textContent = '$' + rentalIncome.toLocaleString();
        document.getElementById('cash-flow').textContent = (cashFlow >= 0 ? '+' : '') + '$' + Math.round(cashFlow).toLocaleString();
        document.getElementById('annual-income').textContent = '$' + annualIncome.toLocaleString();
        document.getElementById('break-even').textContent = breakEvenYears !== Infinity ? breakEvenYears.toFixed(1) + ' years' : 'N/A';
        document.getElementById('roi-5yr').textContent = roi5yr.toFixed(1) + '%';
        document.getElementById('roi-10yr').textContent = roi10yr.toFixed(1) + '%';
        document.getElementById('roi-15yr').textContent = roi15yr.toFixed(1) + '%';
        
        // Update highlight message
        const highlightMessage = document.getElementById('highlight-message');
        if (cashFlow > 0) {
            highlightMessage.textContent = `Your ADU could generate $${annualIncome.toLocaleString()} per year in Maryland. That's $${Math.round(cashFlow).toLocaleString()} positive cash flow per month!`;
            highlightMessage.style.background = 'var(--secondary-green-light)';
            highlightMessage.style.color = 'var(--secondary-green)';
        } else {
            highlightMessage.textContent = `Your ADU could generate $${annualIncome.toLocaleString()} per year in Maryland. Consider adjusting size or finish level to improve cash flow.`;
            highlightMessage.style.background = 'var(--primary-blue-light)';
            highlightMessage.style.color = 'var(--primary-blue)';
        }
    }
});
