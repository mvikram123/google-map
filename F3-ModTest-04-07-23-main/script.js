
let getDataBtn = document.getElementById('get-data');
getDataBtn.addEventListener("click", displayData);

let ip;
let latitude;
let longitude;
let zone;
let dateTime;
var pincode;
let arr;

function displayData() {
    // function to display data-page when buttton is cllicked
    (() => {
        let getDataPage = document.getElementById('get-data-page');
        let displayDataPage = document.getElementById('display-data-page');

        getDataPage.classList.add('display-none');
        displayDataPage.removeAttribute('class');
    })();

    getLocationInfo(ip);



}

function getIp() {
    $.getJSON("https://api.ipify.org?format=json")
        .done(function (data) {
            ip = data.ip;
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Error:", textStatus, errorThrown);
        });
}

function getLocationInfo(ip) {

    const url = `https://ipinfo.io/${ip}?token=4f5799d742f453`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            ipData = data;
            loc = data.loc;
            loc = loc.split(",");
            latitude = loc[0];
            longitude = loc[1];
            zone = data.timezone;
            pincode = data.postal;
            displayPostDetail(pincode);
            getTimeZone(zone);

            // setting src for i frame google map using latitude & longitude
            document.getElementById('map-frame').setAttribute('src', `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`);

            displayInfo(data);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

function getTimeZone(zone) {
    dateTime = new Date().toLocaleString("en-US", { timeZone: `${zone}` });
}

function displayInfo(data) {
    let lat = document.getElementsByClassName('latitude')[0];
    let long = document.getElementsByClassName('longitude')[0];
    let region = document.getElementsByClassName('region')[0];
    let city = document.getElementsByClassName('city')[0];
    let org = document.getElementsByClassName('org')[0];
    let timeZone = document.getElementsByClassName('time-zone')[0];
    let date = document.getElementsByClassName('date-time')[0];
    let pin = document.getElementsByClassName('pincode')[0];


    lat.textContent = `${latitude}`;
    long.textContent = `${longitude}`;
    region.textContent = `${data.region}`;
    city.textContent = `${data.city}`;
    org.textContent = `${data.org}`;
    pin.textContent = `${data.postal}`;
    date.textContent = `${dateTime}`;
    timeZone.textContent = `${zone}`;
}

function displayPostDetail(pincode) {
    const url = `https://api.postalpincode.in/pincode/${pincode}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let mes = document.getElementsByClassName('message')[0];
        mes.textContent = `${data[0].Message}`;
        arr = data[0].PostOffice;
        arr.map(createPostbox);
    })
    .catch(error => {
        console.log('Error:', error);
    });

}

function createPostbox(ele) {
    let con = document.createElement('div');
    con.classList.add('postal-box');

    con.innerHTML = `
                    <p>Name: ${ele.Name}</p>
                    <p>Branch Type: ${ele.BranchType}</p>
                    <p>Delivery Status: ${ele.DeliveryStatus}</p>
                    <p>District: ${ele.District}</p>
                    <p>Division: ${ele.Division}</p>`

    par = document.getElementsByClassName('postal-display')[0];
    par.append(con);
}

const searchBox = document.getElementById('filter-search');
searchBox.addEventListener('input', searchPostalOffices);

function searchPostalOffices() {
    const searchTerm = searchBox.value.toLowerCase();

    const filteredArr = arr.filter(item =>
        item.Name.toLowerCase().includes(searchTerm) ||
        item.BranchType.toLowerCase().includes(searchTerm)
    );

    const postalDisplay = document.getElementsByClassName('postal-display')[0];
    postalDisplay.innerHTML = '';

    filteredArr.forEach(createPostbox);
}


document.addEventListener('DOMContentLoaded', (event) => {
    getIp();
});