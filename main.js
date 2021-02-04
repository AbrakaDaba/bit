
var userLocation = {};
var map;
var overlayMap;
var numberRandomPoints = 100;
var markers = [];
var markerInfoWindow = [];
var currentcircle;
var mapcenter;
var myOptions;
var geocoder;
var center_change_timeout;
var validatedMapPoints = [];
var mapcenterPrev;
var countryNames = {};
var dialCodes = [];
// WARNING - COUNTDOWN
var h = "0" + 1;
var m = 24;
var s = 19;
var countDown = document.getElementsByClassName("warning__countdown")[0];
var countDownCta = document.getElementsByClassName("cta__countdown")[0];

var inputs = document.getElementsByClassName("form__input");
var headerFormEl = document.getElementsByClassName("form-box_2");
var footerFormEl = document.getElementsByClassName("footer-form2");
var formBtnNext = document.getElementsByClassName("btn-next")[0];
var formFooterBtnNext = document.getElementsByClassName("btn-footer-next")[0];
var closeWarningBtn = document.getElementsByClassName("warning__close")[0];

closeWarningBtn.addEventListener("click", function () {
    document.getElementsByClassName("warning")[0].style.display = "none";
    if($(window).width()>767){
        document.getElementsByClassName("top-content")[0].style.marginTop = "-10px";
    }
})

for (i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", checkInputFilled);
}
var ajaxManager = (function() {
    var requests = [];

    return {
       addReq:  function(opt) {
           requests.push(opt);
       },
       removeReq:  function(opt) {
           if( $.inArray(opt, requests) > -1 )
               requests.splice($.inArray(opt, requests), 1);
       },
       run: function() {
           var self = this,
               oriSuc;

           if( requests.length ) {
               oriSuc = requests[0].complete;

               requests[0].complete = function() {
                    if( typeof(oriSuc) === 'function' ) oriSuc();
                    requests.shift();
                    self.run.apply(self, []);
               };

               $.ajax(requests[0]);
           } else {
             self.tid = setTimeout(function() {
                self.run.apply(self, []);
             }, 1000);
           }
       },
       stop:  function() {
           requests = [];
           clearTimeout(this.tid);
       }
    };
}());

// Check if input is filled
function checkInputFilled() {
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== "") {
            inputs[i].classList.add("input-filled")
        } else {
            inputs[i].classList.remove("input-filled");
        }
        if (document.getElementsByClassName("form__input1").length == document.getElementsByClassName("input-filled").length) {
            formBtnNext.onclick = formStepTwo;
        }
        if (document.getElementsByClassName("form__input41").length == document.getElementsByClassName("input-filled").length) {
            formFooterBtnNext.onclick = formFooterStepTwo;
        }
    }
}
// taking to the next step (if every input field is filled out)
function formStepTwo() {
    setTimeout(function () {
        for (i = 0; i < headerFormEl.length; i++) {
            headerFormEl[i].classList.toggle("form-switch");
        }
    }, 200)
}

function formFooterStepTwo() {
    setTimeout(function () {
        for (i = 0; i < footerFormEl.length; i++) {
            footerFormEl[i].classList.toggle("form-switch");
        }
    }, 200)
}

// MODAL - Profit Calculator

var stopModal = $('.stop-modal');
var profitModal = $(".modal_profit-calc");
var btnModal = document.getElementsByClassName("btn_profit-calc")[0];
var closeModalBtn = $('.stop__close,.close-modal_profit-calc');

function modalOpen() {
    document.querySelector("body").style.overflow = "hidden";
}

function modalClose() {
    document.querySelector("body").style.overflow = "visible";
}

// OPEN CONFIRMATION MODAL FUNCTION
function confirmationModal() {
    modalOpen();
    profitModal.show();
    profitModal.css('top', `${window.scrollY}px`);
}

// OPEN CONFIRMATION MODAL FUNCTION
function stopDontGoModal() {
    modalOpen();
    stopModal.show();
    stopModal.css('top', `${window.scrollY}px`);
}

var countDownTimer = setInterval(function () {
    s--;
    if (s < 10 && s > -1) {
        s = "0" + s;
    }

    if (s == -1) {
        s = 59;
        m--;
        if (m < 10 && m > -1) {
            m = "0" + m;
        }
    }
    if (m == -1) {
        m = 59;
        h--;
        if (h < 10 && h > -1) {
            h = "0" + h;
        }
    }
    countDown.innerHTML = h + ":" + m + ":" + s;
    countDownCta.innerHTML = h + ":" + m + ":" + s;

    if (h == 0 && m == 0 && s == 0) {

        countDown.innerHTML = "registration closed";
        countDownCta.innerHTML = "registration closed";
        clearInterval(countDownTimer);
    }
}, 1000);

var _scrFixW = document.documentElement.clientWidth > 1400 ? 440:100;
var _scrFixH = document.documentElement.clientWidth > 1400 ? 180:100;

var _scrFixWWW = document.documentElement.clientWidth > 1400 ? 220:90;

var mwa = $('#map').innerWidth();
var mha = $('#map').innerHeight();
var wa = mwa - _scrFixW;
var ha = mha - _scrFixH;

var matX = Math.floor(wa/10) - 10;
var matY = Math.floor(ha/10) - 14;

var matXY = [];
// for (var ia = 0; ia<matX; ia++) {
//     for (var ja = 0; ja<matY; ja++) {
//         var ij = ia+'-'+ja;
//         matXY[ij] = true;
//     }
// }

console.log("matXY => ", matXY);
var mapProjection;


var _clWidth = document.documentElement.clientWidth;
var _pointsLimit = _clWidth > 1400 ? 8: _clWidth < 768 ? 4 : 6;


var startedPrint = false;
var _failed = 0;
function createPin(a,b) {

	const x = Math.floor(matX * Math.random()) + 1;
	const y = Math.floor(matY * Math.random()) + 1;

    const keyField = x+'-'+y;
    const keyField2 = (x - 10)+'-'+(y-7);
    const keyField3 = (x + 10)+'-'+(y-7);
    const keyField4 = (x - 10)+'-'+(y+4);
    const keyField5 = (x + 10)+'-'+(y+4);

    _failed += 1;

    if (matXY.indexOf(keyField)==-1 && matXY.indexOf(keyField2)==-1 &&
        matXY.indexOf(keyField3)==-1 && matXY.indexOf(keyField4)==-1 &&
        matXY.indexOf(keyField5)==-1) {
		matXY.push(keyField);

        for (var ix = x - 10, il = x + 10; ix<il; ix++) {
            for (var jy = y - 7, yl = y + 4; jy<yl; jy++) {
                var ixjy = ix+'-'+jy;
                if(matXY.indexOf(ixjy)==-1) {
                    matXY.push(ixjy);
                }
            }
        }

        const px = (x*10) + _scrFixWWW;
        const py = (y*10) + 140;
        const pp = new google.maps.Point(px,py);
        const mp = mapProjection.fromContainerPixelToLatLng(pp);

        if (mp.toJSON && validatedMapPoints.length < _pointsLimit && !startedPrint) {
            validatedMapPoints.push(mp.toJSON())
        }

    }

    if ((_failed == _pointsLimit * 3 || validatedMapPoints.length == _pointsLimit) && !startedPrint) {
        startedPrint = true;
        geocodeLatLng(0);
    }
}

//Generate a number of mappoints
function generateMapPoints() {
    var _iteration = 0;

    for (var i = 0, l = _pointsLimit * 3; i<l;i++) {
        new createPin();
        // new createPin(1,1);
        // new createPin(1,matY+1);
        // new createPin(matX+1,1);
        // new createPin(matX+1,matY+1);
        // if (mpr) {
        //     validatedMapPoints.push(mpr);
        // }
        // _iteration+=1;
        // if (validatedMapPoints.length >= 6) {
        //     i = l;
        // }
    }



    // console.log("validatedMapPoints.length", validatedMapPoints.length);
    // if (validatedMapPoints.length) {
    //     geocodeLatLng(0);
    // }
}

function geocodeLatLng(index) {

    if (validatedMapPoints.length == index) {
        return;
    };

    const newmappoint = new google.maps.LatLng(validatedMapPoints[index].lat, validatedMapPoints[index].lng);

    var icon = {
        anchor: new google.maps.Point(8,8),
        strokeWeight: 0,
        scale: 1
    }
    icon.url = 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(`<svg width="16" height="32" viewBox="0 0 16 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="16" r="8" fill="#3875EF"/></svg>`);

    const marker = new google.maps.Marker({
        position: newmappoint,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: icon
    });

    markers.push(marker);
    const _index = index+1;
    setTimeout(showPopups.bind(this, newmappoint, {id: index}), 500);
    setTimeout(geocodeLatLng.bind(this, _index),600);

}

//Destroy all markers
function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function renderNewMarkers() {

    mapcenterPrev = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng()
    }

    clearMarkers();

    mapProjection = overlayMap.getProjection();

    generateMapPoints();
}

function showPopups(position, data) {
        const infowindow = new Popup(
            position,
            data
        );
        infowindow.setMap(map);
}

function createBubbleContent(data) {
    return $(`
        <div class="popup-bubble user-bubble">
            <div class="user-info">
                <img class="user-info__img" src="./assets//users/user5.jpg" alt="user-testimony">
                <p class="user-info__name">Cindy Andrews</p>
                <p class="user-info__data">just earned <span>$` + data.id + `</span></p>
            </div>
            <span class="user-active"></span>
        </div>
    `)[0];
}


class Popup extends google.maps.OverlayView {
    constructor(position, content) {
        super();
        this.position = position;
        //   content.classList.add("popup-bubble");
        // This zero-height div is positioned at the bottom of the bubble.
        const bubbleAnchor = document.createElement("div");
        bubbleAnchor.classList.add("popup-bubble-anchor");
        bubbleAnchor.appendChild(new createBubbleContent(content));
        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement("div");
        this.containerDiv.classList.add("popup-container");
        this.containerDiv.appendChild(bubbleAnchor);
        // Optionally stop clicks, etc., from bubbling up to the map.
        Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
        if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
            this.position
        );
        // Hide the popup when it is far out of view.
        const display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";

        if (display === "block") {
            this.containerDiv.style.left = divPosition.x + "px";
            this.containerDiv.style.top = divPosition.y + "px";
        }

        if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
        }
    }
}

function mapReadyState() {

    mapcenterPrev = {lat: 0, lng:0};
    mapcenter = new google.maps.LatLng(userLocation.center.lat, userLocation.center.lng);
    myOptions = {
        zoom: 15,
        minZoom: 15,
        maxZoom: 15,
        center: mapcenter,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'none'
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);

    google.maps.event.addListener(map, 'tilesloaded', function(){
        if (!overlayMap) {
            overlayMap = new google.maps.OverlayView();
            overlayMap.draw = console.log;
            overlayMap.setMap(map);

            setTimeout(renderNewMarkers, 100);
        }
        console.log('tilesloaded');
    });

    // google.maps.event.addListener(overlayMap, 'tilesloaded', function(){
    //     if (!overlayMap) {
    //         overlayMap = new google.maps.OverlayView();
    //         overlayMap.draw = console.log;
    //         overlayMap.setMap(map);

    //         setTimeout(renderNewMarkers, 2000);
    //     }
    //     console.log('tilesloaded');
    // });
}

function generatePhoneCodes() {
    var generatedList = '<select name="" class="phone-code">';

    for (var i = 0; i<dialCodes.length; i++) {
        if (dialCodes[i].dial_code && dialCodes[i].code) {
            generatedList += '<option data-countryCode="' + dialCodes[i].code + '" value="' + dialCodes[i].dial_code + '">' + dialCodes[i].dial_code + '</option>';
        }
    }

    generatedList += '</select>';

    var wrappedEl = $(generatedList);

    $('.phone-code').each((i, blockElement) => {

        $(blockElement).replaceWith(wrappedEl.clone());
    });

    $('.phone-code option[data-countryCode="' + userLocation.country + '"]').each((i, e) => { $(e).prop('selected', true) });

    $('.visitor-country').html(countryNames[userLocation.country]);
}

function checkIfReadyForPrint() {
    if (mapInitialized && Object.keys(countryNames).length && dialCodes.length && Object.keys(userLocation).length) {
        ajaxManager.stop();

        generatePhoneCodes();

        mapReadyState();
    }
}

$(function() {
    ajaxManager.run();

    ajaxManager.addReq({
        type: 'GET',
        url: '/data/dial-codes.json',
        success: function(data){
            dialCodes = data;
            // console.log('dialCodes ',dialCodes);
            checkIfReadyForPrint();
        }
    });
    ajaxManager.addReq({
        type: 'GET',
        url: '/data/country-names.json',
        success: function(data){
            countryNames = data;
            // console.log('countryNames ',countryNames);
            checkIfReadyForPrint();
        }
    });

    ajaxManager.addReq({
        type: 'GET',
        url: 'https://ipinfo.io?callback=json',
        success: function(data){
            if(data.split('json(').length == 2) {
                let jsonForParse = data.split('json(')[1].substr(0, data.split('json(')[1].length - 2);

                userLocation = JSON.parse(jsonForParse);

                console.log(userLocation.city, userLocation.country, userLocation.loc);

                let splitedLoc = userLocation.loc.split(',');

                userLocation.center = {
                    lat: parseFloat(splitedLoc[0]),
                    lng: parseFloat(splitedLoc[1]),
                };

                // console.log("userLocation ", userLocation);
                checkIfReadyForPrint();
            }
        }
    });



    var scrollToForm = $('.form-choice:first').offset();

    $('.position-to-form').on('click', ()=> {
        window.scrollTo(scrollToForm.left,scrollToForm.top);
    })

    $('#formJoinTop').on('click', () => {
        stopDontGoModal();
    })

    $('#formJoinModal').on('click', () => {
        // stopDontGoModal();
    })

    btnModal.addEventListener("click", confirmationModal);

    closeModalBtn.on('click', () => {
        modalClose();
        profitModal.hide();
        stopModal.hide();
    })
});
