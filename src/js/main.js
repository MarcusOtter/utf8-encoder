const encodeButton = document.getElementById("js-encode");
const decodeButton = document.getElementById("js-decode");

const encodeSection = document.getElementById("js-encode-section");
const decodeSection = document.getElementById("js-decode-section");

const binaryButton      = document.getElementById("js-binary");
const hexadecimalButton = document.getElementById("js-hexadecimal");
const decimalButton     = document.getElementById("js-decimal");

const offsetRangeInput  = document.getElementById("js-offset-input-range");
const offsetNumberInput = document.getElementById("js-offset-input-number");

const buttonNotFilledClassName = "button-outline";

let isEncoding = true;
let currentBase = 2;
let currentOffsetDecimal = 0;

function setIsEncoding(shouldEncode) {
    if (isEncoding === shouldEncode) { return; }

    encodeButton.classList.toggle(buttonNotFilledClassName, !shouldEncode);
    decodeButton.classList.toggle(buttonNotFilledClassName,  shouldEncode);

    encodeSection.hidden = !shouldEncode;
    decodeSection.hidden =  shouldEncode;

    isEncoding = shouldEncode;
}

function setBase(newBase) {
    binaryButton     .classList.toggle(buttonNotFilledClassName, newBase !== 2);
    hexadecimalButton.classList.toggle(buttonNotFilledClassName, newBase !== 16);
    decimalButton    .classList.toggle(buttonNotFilledClassName, newBase !== 10);
    
    currentBase = newBase;
    
    updateOffsetValue(currentOffsetDecimal, 10, currentBase);
}

// 8-bit signed integer
function decimalToStringWithNewBase(decimalValue, newBase) {
    // If negative number, start counting backwards from 255 (2-complement)
    if (newBase !== 10 && decimalValue < 0) {
        decimalValue =  0xFF + decimalValue + 1;
    }

    output = parseInt(decimalValue, 10).toString(newBase);

    if (newBase === 2) {
        output = formatBinary(output);
    }
    else if (newBase === 16) {
        output = formatHexadecimal(output);
    }
    else if (newBase === 10) {
        output = formatDecimal(output);
    }

    return output;
}

function binaryToDecimal(binaryValue) {
    binaryValue = binaryValue.toString().replace(/\s+/g, '');

    // Why doesn't parseInt() understand signed integers :(
    const isNegative = binaryValue[0] === "1";

    return isNegative
        ? -(0xFF + 1) + parseInt(binaryValue, 2)
        : parseInt(binaryValue, 2);
}

function hexadecimalToDecimal(hexadecimalValue) {
    const negatives = ["8", "9", "A", "B", "C", "D", "E", "F"];
    const isNegative = negatives.includes(hexadecimalValue[2]);

    return isNegative
        ? -(0xFF + 1) + parseInt(hexadecimalValue, 16)
        : parseInt(hexadecimalValue, 16);
}

function formatBinary(binaryString) {
    // Append zeroes if MSB not in full group of 4
    let lengthMod4 = binaryString.length % 4;
    if (lengthMod4 !== 0) {
        binaryString = "0".repeat(4 - lengthMod4) + binaryString;
    }

    if (binaryString.length === 4) {
        binaryString = "0000" + binaryString;
    }
    
    // Add spacing between each group of 4 bits
    let output = "";
    for (let i = 0; i < binaryString.length; i += 4) {
        output += binaryString.substr(i, 4) + " ";
    }
    
    return output.trim();
}

function formatHexadecimal(hexadecimalString) {
    if (hexadecimalString.length === 1) {
        hexadecimalString = "0" + hexadecimalString;
    }

    return "0x" + hexadecimalString.toUpperCase();
}

function formatDecimal(decimalString) {
    return parseInt(decimalString).toLocaleString();
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
        number = parseInt(numberString, 10);
    }

    if (number > 127)  { number =  127; }
    if (number < -128) { number = -128; }

    let numberStringNewBase = decimalToStringWithNewBase(number, newBase);

    offsetRangeInput .value = number;
    offsetNumberInput.value = numberStringNewBase;
    
    currentOffsetDecimal = number;
}

encodeButton.onclick = () => setIsEncoding(true);
decodeButton.onclick = () => setIsEncoding(false);

binaryButton     .onclick = () => setBase(2);
hexadecimalButton.onclick = () => setBase(16);
decimalButton    .onclick = () => setBase(10);

offsetRangeInput .oninput  = () => updateOffsetValue(offsetRangeInput.value, 10, currentBase);
offsetNumberInput.onchange = () => updateOffsetValue(offsetNumberInput.value, currentBase, currentBase);

setBase(2);
updateOffsetValue(0, 10, currentBase);
