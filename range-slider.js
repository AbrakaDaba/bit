var rangeInputs = document.getElementsByClassName("custom-range-slider");
var depositVal
var timeVal
var potPayout;
var payoutEl = document.getElementsByClassName("payout-box__amount")[0];
var tooltips = document.getElementsByClassName("current-value-box");

var browserCheck = !(document.documentMode || /Edge\//.test(navigator.userAgent) || /Edg\//.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent)); //coloring range track with different colors in these browsers done via css pesudo elements

document.addEventListener('DOMContentLoaded', initRangeColorTooltip);
document.addEventListener('DOMContentLoaded', ieTooltips);

function ieTooltips() { 
    if (!document.documentMode) {
        for (i = 0; i < tooltips.length; i++) {
            tooltips[i].style.display = "block";
        }
    }else{
        console.log(tooltips, "noa");
        for (i = 0; i < tooltips.length; i++) {
            tooltips[i].style.display = "none";
        }
    }
}

// Color of left side of slider (before slider-thumb) - Initial coloring and tooltip initial position
function initRangeColorTooltip() {
    for (i = 0; i < rangeInputs.length; i++) {
        if (browserCheck) {
            rangeInputs[i].style.background = 'linear-gradient(to right, #3875EF 0%, #3875EF ' + (rangeInputs[i].value - rangeInputs[i].min) / (rangeInputs[i].max - rangeInputs[i].min) * 100 + '%, rgba(18, 17, 66, 0.2) ' + (rangeInputs[i].value - rangeInputs[i].min) / (rangeInputs[i].max - rangeInputs[i].min) * 100 + '%, rgba(18, 17, 66, 0.2) 100%)';

        }
        rangeInputs[i].oninput = sliderColorAndTooltip;
        var currentValueBox = rangeInputs[i].nextElementSibling.getElementsByClassName("current-value-box__num")[0]
        var rangePercent = rangeInputs[i].value;
        currentValueBox.style.transform = "translateX(-50%)";
        currentValueBox.style.left = 100 / rangeInputs[i].max * rangePercent + "%";

        if (rangeInputs[i].classList.contains("calc-range__time__slider")) {
            currentValueBox.innerHTML = rangePercent + " days";
        } else {
            currentValueBox.innerHTML = "$" + rangePercent;
        }
    }
}


// Color of left side of slider (before slider-thumb) and tooltip with current value
function sliderColorAndTooltip() {
    var currentValueBox = this.nextElementSibling.getElementsByClassName("current-value-box__num")[0]
    var rangePercent = this.value;
    if (browserCheck) {
        this.style.background = 'linear-gradient(to right, #3875EF 0%, #3875EF ' + (rangePercent - this.min) / (this.max - this.min) * 100 + '%, rgba(18, 17, 66, 0.2) ' + (rangePercent - this.min) / (this.max - this.min) * 100 + '%, rgba(18, 17, 66, 0.2) 100%)';
    }
    currentValueBox.style.transform = "translateX(-50%)";
    currentValueBox.style.left = 100 / this.max * rangePercent + "%";

    if (this.classList.contains("calc-range__time__slider")) {
        currentValueBox.innerHTML = rangePercent + " days";
    } else {
        currentValueBox.innerHTML = "$" + rangePercent;
    }
}

// Deposit (input field >> range slider)
function inputDeposit() {
    var days = document.getElementById("currency").value
    document.getElementsByClassName("calc-range__deposit__slider")[0].value = days;
    initRangeColorTooltip()
    potentialPayout();
}

// Deposit (range slider >> input field)
function sliderDeposit(e) {
    var deposit = e.value;
    document.getElementById("currency").value = deposit;
    potentialPayout();
}

// TIME-OF-USAGE (input field >> range slider)
function inputDays() {
    var days = document.getElementById("time-unit-days").value
    document.getElementsByClassName("calc-range__time__slider")[0].value = days;
    initRangeColorTooltip()
    potentialPayout();
}

// TIME-OF-USAGE (range slider >> input field)
function sliderDays(e) {
    var days = e.value;
    document.getElementById("time-unit-days").value = days;
    potentialPayout();
}

// Potential Patout Output
function potentialPayout() {
    depositVal = document.getElementsByClassName("calc-range__deposit__slider")[0].value;
    timeVal = document.getElementsByClassName("calc-range__time__slider")[0].value;
    potPayout = depositVal * timeVal / 30; /// FORMULA GOES HERE! ///
    potPayout = Math.round(potPayout).toLocaleString();
    // potPayout = potPayout.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");  //regex for thousands separators
    payoutEl.innerHTML = "$" + potPayout;
}