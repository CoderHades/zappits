// Set the target date for the countdown to end (you can change this)
let targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 9);
targetDate.setHours(targetDate.getHours() + 22);
targetDate.setMinutes(targetDate.getMinutes() + 35);
targetDate.setSeconds(targetDate.getSeconds() + 24);

function updateCountdown() {
    let now = new Date();
    let diff = targetDate - now;

    if (diff <= 0) {
        clearInterval(interval);
        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "0";
        document.getElementById("minutes").textContent = "0";
        document.getElementById("seconds").textContent = "0";
        return;
    }

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

let interval = setInterval(updateCountdown, 1000);

function ordinalSuffix(i) {
    const j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function formatDate() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dayOfMonth = ordinalSuffix(now.getDate());

    return `${dayName}, ${dayOfMonth} ${monthName} ${now.getFullYear()}`;
}



$('#revealButton').on('click', function(){
    $('#overlay, #popup-modal').removeClass('d-none');
});

$('.closeModals').on('click', function(){
    $('#overlay, #popup-modal, #storeSelect, #barCodeModal, #notAcceptedmodal').addClass('d-none');
    $('#areYouReady').removeClass('d-none');
});

$('.storeSelector').on('click', function(){
    $('#areYouReady').addClass('d-none');
    $('#storeSelect').removeClass('d-none');
});

const urlParams = new URLSearchParams(window.location.search);
const staticBarcode = urlParams.get('static');
var retailers = $('body').data('retailers');
$.each(retailers.retailers, function(key, value){
    $('.' + key).removeClass('d-none').attr('data-barcode', value);
});

$('#campaignStart').text(retailers.startDate);
$('#campaignEnd').text(retailers.endDate);
$('#companyName').text(retailers.affiliate.charAt(0).toUpperCase() + retailers.affiliate.slice(1));
$('.coupon-logo').attr('src', 'banners/' + retailers.affiliate + '.png');

function updateExpiry(){
    window.targetExpiry = new Date();
    window.targetExpiry.setMinutes(targetExpiry.getMinutes() + 20);
    window.targetExpiry.setSeconds(targetExpiry.getSeconds());
}

function updateExpiryCountdown() {
    let now = new Date();
    let diff = window.targetExpiry - now;

    if (diff <= 0) {
        updateExpiry();
        return;
    }

    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("expiryMinutes").textContent = minutes;
    document.getElementById("expirySeconds").textContent = seconds;
}

$('.retailer-list .unit').on('click', function(){
    $('.closeModals').trigger('click');
    $('.map-link-wrapper, .code-showing-despite-print, #offer_code_and_countdown_wrapper, .inStoreReady, #dema-offer_countdown, .first-seperator, #mainHeadline, .sub-headline').addClass('d-none');
    $('#scanUntilAccepted, #afterActive').removeClass('d-none');
    $('.unlockedTime').text(formatDate());

    if($(this).data('store') == "tescos"){
        var store = "tesco";
    }
    else{
        var store = $(this).data('store');
    }
    $('#retailerImage').attr("style", "background-image: url('stores/" + store + ".png');");

    if(staticBarcode !== null){
        var appendage = retailers.retailers[$(this).data('store')] + ".png";
    }
    else{
        var appendage = "enc_" + retailers.retailers[$(this).data('store')] + ".gif";
    }

        console.log(appendage);
    var url = "https://media.discordapp.net/attachments/1193341923025494036/1193379455624806461/Fairyv-2.gif?ex=65ac803a&is=659a0b3a&hm=facf23f13838469d20dc9d42e7709d1a475a2d4e14c813fd1c972098fc6bc405&="
    $('#barCodeWrapper').css({ "--encryped-barcode-background": "url(" + url + ")" });
    $('#rawBarcode').text(retailers.retailers[$(this).data('store')]);

    clearInterval(window.interval);
    updateExpiry();
    window.interval = setInterval(updateExpiryCountdown, 1000);
})

$('#overlay').on('click', function(){
    $('.closeModals').trigger('click');
});

$('#switchRetailer').on('click', function(){
    $('#revealButton').trigger('click');
    $('.storeSelector').trigger('click');
});

$('#showBarcodeNumberButton').on('click', function(){
    $('.holderEncrypt, #rawBarcode').toggleClass('d-none');
    var old_text = $(this).find('.map-link').text();
    $(this).find('.map-link').text($(this).attr('data-swap-text'));
    $(this).attr('data-swap-text', old_text);
    $(this).toggleClass(['hide-barcode-number', 'show-barcode-number']);
});

$('.questionNeeded').on('click', function(){
    $(this).find('.feedbackNewSpan').toggleClass('button-highlight');
    $('#INeedHelp').toggleClass('d-none');
});

$('#notAcceptedButton').on('click', function(){
    $('#notAcceptedmodal, #overlay').removeClass('d-none');
});

$('#numberButton').on('click', function(){
    $('#barCodeModal, #overlay').removeClass('d-none');
});
