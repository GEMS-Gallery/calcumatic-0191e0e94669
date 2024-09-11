import { backend } from 'declarations/backend';

let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const resultDisplay = document.getElementById('result');
const loader = document.getElementById('loader');

function updateDisplay() {
    resultDisplay.value = currentInput || '0';
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentInput = digit;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        performCalculation();
    }
    waitingForSecondOperand = true;
    operator = nextOperator;
}

async function performCalculation() {
    const inputValue = parseFloat(currentInput);
    if (isNaN(firstOperand) || isNaN(inputValue)) return;

    loader.style.display = 'block';
    try {
        const result = await backend.calculate(operator, firstOperand, inputValue);
        currentInput = String(result);
        firstOperand = result;
    } catch (error) {
        currentInput = 'Error';
    }
    loader.style.display = 'none';
    updateDisplay();
}

function resetCalculator() {
    currentInput = '';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

document.querySelector('.keypad').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        handleOperator(target.dataset.op);
        return;
    }
    if (target.classList.contains('decimal')) {
        inputDecimal();
        return;
    }
    if (target.classList.contains('clear')) {
        resetCalculator();
        return;
    }
    if (target.classList.contains('equals')) {
        performCalculation();
        return;
    }
    inputDigit(target.textContent);
});

updateDisplay();