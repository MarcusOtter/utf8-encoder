const encodeButton = document.getElementById("js-encode");
const decodeButton = document.getElementById("js-decode");

const encodeSection = document.getElementById("js-encode-section");
const decodeSection = document.getElementById("js-decode-section");

const buttonNotFilledClassName = "button-outline";

let isEncoding = true;

function setIsEncoding(newValue) {
    if (isEncoding === newValue) { return; }

    encodeButton.classList.toggle(buttonNotFilledClassName, !newValue);
    decodeButton.classList.toggle(buttonNotFilledClassName,  newValue);

    encodeSection.hidden = !newValue;
    decodeSection.hidden =  newValue;

    isEncoding = newValue;
}

encodeButton.onclick = () => setIsEncoding(true);
decodeButton.onclick = () => setIsEncoding(false);
