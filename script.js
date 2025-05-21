let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

const guestCheckbox = document.getElementById('guest');
const passwordDiv = document.getElementById('passwordDiv');
const passwordInput = document.getElementById('exampleInputPassword1');
const vatUEYes = document.getElementById('vatUEYes');

guestCheckbox.addEventListener('change', function () {
    if (this.checked) {
        passwordInput.disabled = true;
        passwordInput.removeAttribute('required');
        passwordInput.classList.add('opacity-50');
    } else {
        passwordInput.disabled = false;
        passwordInput.setAttribute('required', 'required');
        passwordInput.classList.remove('opacity-50');
    }
});

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryInput.appendChild(option);
        });
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            // TODO inject country to form and call getCountryCode(country) function
            const countryOptions = Array.from(countryInput.options);
            const match = countryOptions.find(opt => opt.value.toLowerCase() === country.toLowerCase());

            if (match) {
                countryInput.value = match.value;
            }

            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join('');
            // TODO inject countryCode to form
            const countryCodeSelect = document.getElementById('countryCode');

            const matchingOption = Array.from(countryCodeSelect.options).find(option => option.value === countryCode);

            if (matchingOption) {
                countryCodeSelect.value = matchingOption.value;
            } else {
                const newOption = document.createElement('option');
                newOption.value = countryCode;
                newOption.textContent = `${countryCode} (automatyczne)`;
                newOption.selected = true;
                countryCodeSelect.appendChild(newOption);
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

document.getElementById('submitButton').addEventListener('click', function () {
    myForm.classList.add('submitted-checked');

    if (myForm.checkValidity()) {
        const modal = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
        modal.show();
    } else {
        console.error('Form is invalid. Please correct the errors and try again.');
        form.reportValidity();
    }
});

vatUEYes.addEventListener('change', function () {
    console.log('VAT EU checkbox changed:', this.checked);
    document.querySelectorAll('.vatElement').forEach(el => {
        if (this.checked) {
            el.classList.remove('d-none');
            el.querySelectorAll('input, textarea').forEach(input => (input.disabled = false));
        } else {
            el.classList.add('d-none');
            el.querySelectorAll('input, textarea').forEach(input => (input.disabled = true));
        }
    });
});

(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    fetchAndFillCountries().then(() => {
        getCountryByIP();
    });
})();
