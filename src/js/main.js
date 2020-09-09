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
let currentNumeralSystem = "BIN";
let currentOffset = 0;

function setIsEncoding(shouldEncode) {
    if (isEncoding === shouldEncode) { return; }

    encodeButton.classList.toggle(buttonNotFilledClassName, !shouldEncode);
    decodeButton.classList.toggle(buttonNotFilledClassName,  shouldEncode);

    encodeSection.hidden = !shouldEncode;
    decodeSection.hidden =  shouldEncode;

    isEncoding = shouldEncode;
}

function setNumeralSystem(newSystem) {
    binaryButton.classList.toggle(buttonNotFilledClassName, newSystem !== "BIN");
    hexadecimalButton.classList.toggle(buttonNotFilledClassName, newSystem !== "HEX");
    decimalButton.classList.toggle(buttonNotFilledClassName, newSystem !== "DEC");
    
    currentNumeralSystem = newSystem;
}

function updateOffsetValue(newOffset) {
    offsetRangeInput.value = newOffset;
    offsetNumberInput.value = newOffset;
    
    currentOffset = newOffset;
}

encodeButton.onclick = () => setIsEncoding(true);
decodeButton.onclick = () => setIsEncoding(false);

binaryButton     .onclick = () => setNumeralSystem("BIN");
hexadecimalButton.onclick = () => setNumeralSystem("HEX");
decimalButton    .onclick = () => setNumeralSystem("DEC");

offsetRangeInput .oninput = () => updateOffsetValue(offsetRangeInput.value);
offsetNumberInput.oninput = () => updateOffsetValue(offsetNumberInput.value);

updateOffsetValue(0);