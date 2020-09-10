// ====================================================================================== //
// Copyright (C) 2020  Marcus Otterström
// Read the license at https://utf8.otterstrom.dev/LICENSE.txt
// ====================================================================================== //

// This is not a pretty file
// Javascript is not pretty
// Imagine having to use regex to remove spaces from a string
// Imagine having to manually convert numbers to other numeral systems because they're signed
// I have so much duplicated, redundant code, it all needs to be heavily refactored
// Should've made this with blazor :(
// Thank you

const encodeButton = document.getElementById("js-encode");
const decodeButton = document.getElementById("js-decode");

const encodeSection = document.getElementById("js-encode-section");
const decodeSection = document.getElementById("js-decode-section");

const binaryButton      = document.getElementById("js-binary");
const hexadecimalButton = document.getElementById("js-hexadecimal");
const decimalButton     = document.getElementById("js-decimal");

const offsetRangeInput  = document.getElementById("js-offset-input-range");
const offsetNumberInput = document.getElementById("js-offset-input-number");

const encodeInput = document.getElementById("js-encode-input");
const decodeInput = document.getElementById("js-decode-input");
const outputField = document.getElementById("js-output");

const buttonNotFilledClassName = "button-outline";

let isEncoding = false;
let currentBase = 2;
let currentOffsetDecimal = 0;

function setIsEncoding(shouldEncode) {
    if (isEncoding === shouldEncode) { return; }

    encodeButton.classList.toggle(buttonNotFilledClassName, !shouldEncode);
    decodeButton.classList.toggle(buttonNotFilledClassName,  shouldEncode);

    encodeSection.hidden = !shouldEncode;
    decodeSection.hidden =  shouldEncode;

    clearInputOutput();
    isEncoding = shouldEncode;
    
    setPlaceholderText(isEncoding, currentBase);
}

function setPlaceholderText(isEncoding, base) {
    if (isEncoding) {
        encodeInput.placeholder = "Example...";
        outputField.placeholder = encode(base, encodeInput.placeholder, currentOffsetDecimal);
    } else {
        outputField.placeholder = "Example...";
        decodeInput.placeholder = encode(base, outputField.placeholder, currentOffsetDecimal * -1);
    }
}

function setBase(newBase) {
    binaryButton     .classList.toggle(buttonNotFilledClassName, newBase !== 2);
    hexadecimalButton.classList.toggle(buttonNotFilledClassName, newBase !== 16);
    decimalButton    .classList.toggle(buttonNotFilledClassName, newBase !== 10);
    
    let fieldValue;
    let stringsToConvert;
    if (isEncoding) {
        fieldValue = outputField.value.trim();
        stringsToConvert = fieldValue.split(" ");
    } else {
        fieldValue = decodeInput.value.trim();
        stringsToConvert = fieldValue.split(" ");
    }

    if (fieldValue !== null && fieldValue !== "" && stringsToConvert !== null && stringsToConvert.length !== 0) {
        let decimalNumbers = convertNumberStringsToDecimal(currentBase, stringsToConvert);
        let convertedStrings = decimalNumbers.map((num) => decimalToStringWithNewBase(num, newBase));
    
        if (isEncoding) {
            outputField.value = convertedStrings.join(" ");
        } else { 
            decodeInput.value = convertedStrings.join(" ");
        }
    }

    currentBase = newBase;
    updateOffsetValue(currentOffsetDecimal, 10, newBase);
}

// Signed byte
function decimalToStringWithNewBase(decimalValue, newBase) {
    // If negative number, start counting backwards from 255 (2-complement)
    if (newBase !== 10 && decimalValue < 0) {
        decimalValue =  0xFF + decimalValue + 1;
    }

    output = parseInt(decimalValue, 10).toString(newBase);

    if (newBase === 2) {
        output = formatBinary(output, 8);
    }
    else if (newBase === 16) {
        output = formatHexadecimal(output);
    }
    else if (newBase === 10) {
        output = formatDecimal(output);
    }

    return output;
}

function binaryToDecimal(binaryString) {
    binaryString = binaryString.toString().replace(/\s+/g, '');

    // Why doesn't parseInt() understand signed integers :(
    const isNegative = binaryString[0] === "1";

    return isNegative
        ? -(0xFF + 1) + parseInt(binaryString, 2)
        : parseInt(binaryString, 2);
}

function hexadecimalToDecimal(hexadecimalValue) {
    const negatives = ["8", "9", "A", "B", "C", "D", "E", "F"];
    const isNegative = negatives.includes(hexadecimalValue[2]);

    return isNegative
        ? -(0xFF + 1) + parseInt(hexadecimalValue, 16)
        : parseInt(hexadecimalValue, 16);
}

function formatBinary(binaryString) {
    // Append zeroes if MSB not in full group
    let numbersInMSBGroup = binaryString.length % 8;
    if (numbersInMSBGroup !== 0) {
        binaryString = "0".repeat(8 - numbersInMSBGroup) + binaryString;
    }

    // Force 8 digits
    if (binaryString.length === 4) {
        binaryString = "0000" + binaryString;
    }
    
    // Add spacing between each group of 4 bits
    let output = "";
    for (let i = 0; i < binaryString.length; i += 8) {
        output += binaryString.substr(i, 8) + " ";
    }
    
    return output.trim();
}

function formatHexadecimal(hexadecimalString) {
    if (hexadecimalString.length === 1) {
        hexadecimalString = "0" + hexadecimalString;
    }
    else if (hexadecimalString.length === 4) {
        return hexadecimalString.toUpperCase();
    }

    return "0x" + hexadecimalString.toUpperCase();
}

function formatDecimal(decimalString) {
    return decimalString;
}

function convertNumberStringsToDecimal(numberBase, numberStrings) {
    let sanetizedStrings = sanetizeNumberStrings(numberBase, numberStrings);
    switch(numberBase) { 
        case 2:  return sanetizedStrings.map(binaryToDecimal);
        case 16: return sanetizedStrings.map(hexadecimalToDecimal);
        case 10: return sanetizedStrings.map((val) => parseInt(val, 10));
    }

    return null;
}

function sanetizeNumberStrings(numberBase, numberStrings) {
    switch(numberBase) {
        case 2:  return numberStrings.map((numStr) => formatBinary(numStr, 8));
        case 16: return numberStrings.map(formatHexadecimal);
        case 10: return numberStrings.map(formatDecimal);
    }
}

function applyOffset(decimalNumbers, offsetDecimal) {
    return decimalNumbers.map(num => num + offsetDecimal);
}

function clearInputOutput() {
    encodeInput.value = "";
    decodeInput.value = "";
    outputField.value = "";
}

function updateOffsetValue(numberString, numberStringBase, newBase) {
    // Remove whitespace
    numberString = numberString.toString().replace(/\s+/g, '');

    let number = 0;
    if (numberStringBase === 2) {
        number = binaryToDecimal(numberString);
    }
    else if (numberStringBase === 16) {
        number = hexadecimalToDecimal(numberString);
    }
    else if (numberStringBase === 10) {
        number = parseInt(numberString);
    }

    if (number > 127)  { number =  127; }
    if (number < -128) { number = -128; }

    let numberStringNewBase = decimalToStringWithNewBase(number, newBase);

    offsetRangeInput .value = number;
    offsetNumberInput.value = numberStringNewBase;
    
    currentOffsetDecimal = number;

    if (numberString !== null && numberString !== "") {
        if (isEncoding) {
            outputField.value = encode(currentBase, encodeInput.value.trim(), currentOffsetDecimal);
        } else if (decodeInput.value.trim() !== "") { 
            outputField.value = decode(currentBase, decodeInput.value.trim().split(" "), currentOffsetDecimal);
        }
    }

    setPlaceholderText(isEncoding, currentBase);
}

function encode(numberBase, strToEncode, offsetDecimal) {
    if (strToEncode === "") { return ""; }

    let characters = strToEncode.split("");
    let decimalNumbers = characters.map((char) => char.charCodeAt());
    decimalNumbers = applyOffset(decimalNumbers, offsetDecimal);

    let numberStrings = decimalNumbers.map((num) => decimalToStringWithNewBase(num, numberBase));
    return numberStrings.join(" ");
}

function decode(numberBase, numberStrings, offsetDecimal) {
    let decimalNumbers = convertNumberStringsToDecimal(numberBase, numberStrings);
    decimalNumbers = applyOffset(decimalNumbers, offsetDecimal);

    let output = String.fromCharCode(...decimalNumbers);

    if (output.split("\u0000").join("") === "" && decodeInput.value !== "") {
        output = "Invalid input. Please add spaces between characters and make sure you are using the right numeral system.";
    }

    return output;
}

function setDefaultSettings() {
    setBase(2);
    setIsEncoding(true);
}

encodeButton.onclick = () => setIsEncoding(true);
decodeButton.onclick = () => setIsEncoding(false);

binaryButton     .onclick = () => setBase(2);
hexadecimalButton.onclick = () => setBase(16);
decimalButton    .onclick = () => setBase(10);

offsetRangeInput .oninput  = () => updateOffsetValue(offsetRangeInput.value, 10, currentBase);
offsetNumberInput.onchange = () => updateOffsetValue(offsetNumberInput.value, currentBase, currentBase);

encodeInput.oninput = () => { outputField.value = encode(currentBase, encodeInput.value.trim(), currentOffsetDecimal);  }
decodeInput.oninput = () => { outputField.value = decode(currentBase, decodeInput.value.trim().split(" "), currentOffsetDecimal); }

setDefaultSettings();
