// Input Elements
const clearAll = document.querySelector('input[type="reset"]');
const amountInput = document.getElementById('mortgage-amount');
const termInput = document.getElementById('mortgage-term');
const interestInput = document.getElementById('interest-rate');
const interestRadio = document.getElementById('interest-only');
const repaymentRadio = document.getElementById('repayment');

// Error Messages
const mortgageError = document.querySelector('.mortgage-amount-error');
const termError = document.querySelector('.mortgage-term-error');
const interestError = document.querySelector('.interest-rate-error');
const radioError = document.querySelector('.mortgage-type-error');
// Form
const form = document.querySelector('.input-section form');

// Input Variables
let mortgageAmount = '';
let mortgageTerm = '';
let interestRate = '';
let isRepayment = '';
let isInterestOnly = '';

function updateVariables() {
    mortgageAmount = parseFloat(amountInput.value);
    mortgageTerm = parseFloat(termInput.value);
    interestRate = parseFloat(interestInput.value);
    isRepayment = repaymentRadio.checked;
    isInterestOnly = interestRadio.checked;
}

// Result Section
const resultSection = document.querySelector('.result-section');

function calculateMortgage() {
    // Check if all input are entered or selected
    if(!checkAllSelected()) {
        return;
    }
    // Check which radio button is selected
    if(repaymentRadio.checked) {
        totalRepayment()
    } else {
        interestOnly();
    }
}

function totalRepayment() {    
    let monthlyInterestRate = (interestRate / 100) / 12;
    let numberOfPayments = mortgageTerm * 12;

    let monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    let totalPayment = monthlyPayment * numberOfPayments;

    updateDOM(monthlyPayment.toFixed(2), totalPayment.toFixed(2));
}

function interestOnly() {
    let monthlyInterestRate = (interestRate / 100) / 12;  // Monthly interest rate
    let monthlyInterestPayment = mortgageAmount * monthlyInterestRate; // Monthly interest payment
    let totalInterestPaid = monthlyInterestPayment * mortgageTerm * 12; // Total interest over the entire term

    // Update the DOM with the calculated values
    updateDOM(monthlyInterestPayment.toFixed(2), totalInterestPaid.toFixed(2));
}

function interestOnly() {
    let monthlyInterestRate = (interestRate / 100) / 12;
    let monthlyPayment = mortgageAmount * monthlyInterestRate;
    let totalInterestPaid = monthlyPayment * mortgageTerm * 12;

    updateDOM(monthlyPayment.toFixed(2), totalInterestPaid.toFixed(2));
}

function updateDOM(monthlyValue = 'notset', totalValue = 'notset') {
    if(monthlyValue == 'notset' && totalValue == 'notset') {
        resultSection.classList.remove('displaying');
        resultSection.innerHTML = `
            <img src="assets/images/illustration-empty.svg" alt="Empty">
            <h2>Results shown here</h2>
            <p>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
        `;
    } else {
        resultSection.classList.add('displaying');
        resultSection.innerHTML = `
            <h2>Your results</h2>
            <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>
            <div class="result-card">
                <div class="monthly-result">
                <p class="result-title">Your monthly repayments</p>
                <p class="monthly-repayment">&pound;${monthlyValue}</p>
                </div>
                <div class="total-result">
                <p class="result-title">Total you'll repay over the team</p>
                <p class="total-repayment">&pound;${totalValue}</p>
                </div>
            </div>
        `;
    }
}

function checkAllSelected() {
    // Get values from inputs in global variables
    updateVariables();

    // Check if radio button is selected
    let mortgageType = isRepayment || isInterestOnly;
    manageDomErrors();

    if(!isNaN(mortgageAmount) && !isNaN(mortgageTerm) && !isNaN(interestRate) && mortgageType) {
        return true
    } else {
        return false;
    }
}

function manageDomErrors() {
    // Check if radio button is selected
    let mortgageType = isRepayment || isInterestOnly;
    // Check input variable values and set error accordingly
    if(mortgageAmount == '' || mortgageAmount == null || isNaN(mortgageAmount)) {
        setError(mortgageError);
        setErrorClass(amountInput);
    } else {
        removeError(mortgageError);
        removeErrorClass(amountInput);
    }

    if(mortgageTerm == '' || mortgageTerm == null || isNaN(mortgageTerm)) {
        setError(termError)
        setErrorClass(termInput);
    } else {
        removeError(termError);
        removeErrorClass(termInput);
    }

    if(interestRate == '' || interestRate == null || isNaN(interestRate)) {
        setError(interestError);
        setErrorClass(interestInput);
    } else {
        removeError(interestError);
        removeErrorClass(interestInput);
    }

    if(!mortgageType) {
        setError(radioError);
    } else {
        removeError(radioError);
    }

}

function setError(element) {
    element.style.display = 'block';
}

function removeError(element) {
    element.style.display = 'none';
}

function setErrorClass(element) {
    element.classList.add('error');
}

function removeErrorClass(element) {
    element.classList.remove('error');
}

function resetDOM() {
    // Remove all Errors
    removeError(mortgageError);
    removeErrorClass(amountInput);
    removeError(termError);
    removeErrorClass(termInput);
    removeError(interestError);
    removeErrorClass(interestInput);
    removeError(radioError);
    updateDOM();
    document.querySelector('label[for="repayment"]').classList.remove('selected');
    document.querySelector('label[for="interest-only"]').classList.remove('selected');
}

function checkInput(e) {
    let input = e.target.value;
    e.target.value = input.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if(e.target.value != '') {
        e.target.classList.remove('error');
        const errorID = e.target.getAttribute('id') + '-error';
        document.querySelector(`.${errorID}`).style.display = 'none';
    }
}

function checkRadios() {
    if(repaymentRadio.checked) {
        document.querySelector('label[for="repayment"]').classList.add('selected');
        removeError(radioError);
    } else {
        document.querySelector('label[for="repayment"]').classList.remove('selected');
    }
    
    if(interestRadio.checked) {
        document.querySelector('label[for="interest-only"]').classList.add('selected');
        removeError(radioError);
    } else {
        document.querySelector('label[for="interest-only"]').classList.remove('selected');
    }
}

amountInput.addEventListener('input', checkInput);
termInput.addEventListener('input', checkInput);
interestInput.addEventListener('input', checkInput);
interestRadio.addEventListener('input', checkRadios);
repaymentRadio.addEventListener('input', checkRadios);
clearAll.addEventListener('click', resetDOM);

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateMortgage();
});