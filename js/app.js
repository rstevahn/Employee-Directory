/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * app.js */

/*jshint esversion: 6 */

// First, let's wait for the page to load

window.addEventListener ('DOMContentLoaded', () => {

    let employeeData = []; // the employee data received. used for searching and for the modal dialog data
    let employeeCards = ""; // the HTML we will generate based on the employee data received
    let currentEmployee; // index of the current employee displayed in the modal dialog

    // ------------------------------------------
    //  Function to fetch our data using the Fetch interface
    //  params: url
    //  returns: response or status text
    // ------------------------------------------
    function fetchData(url) {
        return fetch(url)
                .then(checkStatus)  
                .then(res => res.json())
                .catch(error => console.log('Looks like there was a problem!', error));
    }

    // ------------------------------------------
    //  Function to check the response status
    //  params: response
    //  returns: a resolved or rejected promise
    // ------------------------------------------    
    function checkStatus(response) {
        if (response.ok) {
        return Promise.resolve(response);
        } else {
        return Promise.reject(new Error(response.statusText));
        }
    }

    // ------------------------------------------
    //  Function to check for a search match
    //  This function will display or hide the employee card depending on the search term
    //  called by processSearch()
    //  params: search term, employee card, employee data
    //  returns: n/a
    // ------------------------------------------   
    function checkForMatch(searchTerm, employeeCard, employee) {
        const employeeName = employee.name.first.toLowerCase() + " " + employee.name.last.toLowerCase();
        const employeeLocation = employee.location.city.toLowerCase() + ", " + employee.location.state.toLowerCase();
        if (employeeName.indexOf(searchTerm) > -1 || 
            employee.email.toLowerCase().indexOf(searchTerm) > -1 ||
            employeeLocation.indexOf(searchTerm) > -1) { // it's a match
            employeeCard.style.display = ''; // display this card
        } else { // no match
            employeeCard.style.display = 'none'; // hide this card
        }
    }

    // ------------------------------------------
    //  Function to process a search
    //  gallery items
    //  params: event
    //  returns: n/a
    // ------------------------------------------   
    function processSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const employeeCards = document.querySelectorAll('div.card');
        if (searchTerm != '') { // we have a search term
            employeeData.forEach((employee, index) => 
                checkForMatch(searchTerm, employeeCards[index], employee));
        } else { // make sure all cards are displayed
            employeeCards.forEach(card => card.style.display = '');
        }
    }

    // ------------------------------------------
    //  Function to add the search box to the page
    //  and add event listeners to the input elements
    //  params: n/a
    //  returns: n/a
    // ------------------------------------------   
    function addSearchBox() {
        const searchHTML = 
            `<form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
             </form>`;
        document.querySelector('div.search-container').innerHTML = searchHTML;
        document.getElementById('search-input').addEventListener('keyup', processSearch);
        document.getElementById('search-submit').addEventListener('submit', processSearch);
    }
    
    // ------------------------------------------
    //  Function to generate the html for the gallery items
    //  params: results array
    //  returns: innerHTML for the gallery div
    // ------------------------------------------   
    function generateCards(results) {
        const employeeDivs = results.map((employee, index) => 
            `<div class="card" id="${index}">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>`).join("");
        return employeeDivs;
    }

     // --------------------------------------------
    //
    // function to update the modal-info-container
    // param: index
    // returns: n/a
    //
    // --------------------------------------------
    function generateModalInfo(index) {
        const employee = employeeData[index];
        const dob = new Date(employee.dob.date);
        const dobString = dob.getMonth() + '/' + dob.getDate() + '/' + dob.getFullYear(); 
        const innerHTML = 
            `<img class="modal-img" src="${employee.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${employee.phone}</p>
            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state}  ${employee.location.postcode}</p>
            <p class="modal-text dob">Birthday: ${dobString}</p>`;
        document.querySelector('.modal-info-container').innerHTML = innerHTML;     
    }

     // --------------------------------------------
    //
    // function to process the modal 'close' button
    // param: event
    // returns: n/a
    //
    // --------------------------------------------
    function processCloseButton(event) {
        event.preventDefault();
        document.querySelector('.modal-container').style.display = 'none';
    }
    
    // --------------------------------------------
    //
    // function to return an array of the displayed card elements
    // param: n/a
    // returns: array of card elements
    //
    // --------------------------------------------
    function getDisplayedCards (){
        const displayedCards = []; // the array of displayed cards we'll return

        // get all of the div elements with class 'card'
        
        const cards = document.querySelectorAll('div.card');

        // delete any cards that are not displayed due to a search in progress

        cards.forEach((card, index) => {
            if (card.style.display === '') {
                displayedCards.push(card); // add to the displayed cards array
            }
        });

        return displayedCards;
    }
    
    // --------------------------------------------
    //
    // function to find the index of the current employee
    // given an array of employee cards
    // param: array of cards
    // returns: the index of currentEmployee in the array
    //
    // --------------------------------------------
    function indexOfCurrentEmployee(cards) {
        for (let i=0; i<cards.length;i++) {
            if (Number(cards[i].id) === currentEmployee) {
                return i;
            }
        }
        console.log ("Error! Current Employee not found among displayed cards!");
    }
   
    // --------------------------------------------
    //
    // function to process the modal 'prev' button
    // param: event
    // returns: n/a
    //
    // --------------------------------------------
    function processPrevButton(event) {

        let ourIndex; // we will calculate our index in the list of displayed cards

        // get the array of displayed card div elements

        const cards = getDisplayedCards();

        // return if there is only one card

        if (cards.length === 1) {
            return;
        }

        // determine our location in the array

        ourIndex = indexOfCurrentEmployee (cards);

         // if we are not the first element, update and display the previous element

        if (ourIndex > 0) {
            currentEmployee = Number(cards[ourIndex-1].id);
            generateModalInfo(currentEmployee);
        }
        event.preventDefault();
    }

    // --------------------------------------------
    //
    // function to process the modal 'next' button
    // param: event
    // returns: n/a
    //
    // --------------------------------------------
    function processNextButton(event) {
 
        let ourIndex; // we will calculate our index in the list of displayed cards

        // get the array of displayed card div elements

        const cards = getDisplayedCards();

        // return if there is only one card

        if (cards.length === 1) {
            return;
        }

        // determine our location in the array

        ourIndex = indexOfCurrentEmployee(cards);

         // if we are not the last element, update and display the next element

        if (ourIndex < cards.length - 1) {
            currentEmployee = Number(cards[ourIndex+1].id);
            generateModalInfo(currentEmployee);
        }
        event.preventDefault();
    }

    // --------------------------------------------
    //
    // function to generate and display the modal dialog box
    // param: event
    // returns: n/a
    //
    // --------------------------------------------
    function displayOverlay (event) {
        let overlayElement = document.querySelector('.modal-container');
        if (!overlayElement) { // our first time through. create the container div
            const overlayContent = 
                `<div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                     </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>`;
            overlayElement = document.createElement('div');
            overlayElement.className = 'modal-container';
            overlayElement.innerHTML = overlayContent;
            overlayElement.style.zIndex = '1';
            document.querySelector('body').appendChild(overlayElement); // add to the DOM before adding listeners
            document.getElementById('modal-close-btn').addEventListener('click', processCloseButton);
            document.getElementById('modal-prev').addEventListener('click', processPrevButton);
            document.getElementById('modal-next').addEventListener('click', processNextButton);
        }

        // find the employee object corresponding to the target element
        // and create the new '.modal-info-container' content

        const targetName = this.lastElementChild.firstElementChild.innerText;
        for (let i = 0; i < employeeData.length; i++) {
            const comparisonName = employeeData[i].name.first + ' ' + employeeData[i].name.last;
            if (targetName === comparisonName) { // it's a match
                currentEmployee = i;
                generateModalInfo(i); // generate the new content
                break; // we're done here
            }
        }

        // make sure we are displayed

        overlayElement.style.display = "";
    }

    // --------------------------------------------
    //
    // Main Program
    //
    // --------------------------------------------

    // fetch and display the data from the server (or an error message)
 
    fetchData('https://randomuser.me/api/?results=12&nat=us&inc=name,email,location,phone,dob,picture')
        .then((data) => {employeeData = data.results; // save the data for searching and for the modal dialog
                         addSearchBox(); // add the search box
                         employeeData.forEach((employee, index) => employee.index = index); // keep track of our index
                         employeeCards = generateCards(employeeData);}) // generate the cards
        .catch(err => employeeCards = `<div class="card"><h3>An error has occurred:</h3><h4>${err}</h4></div>`)
        .finally(() => {const gallery = document.getElementById('gallery');
                        gallery.innerHTML = employeeCards; // display the cards
                        const cardDivs = document.querySelectorAll('div.card');
                        cardDivs.forEach(div => div.addEventListener("click", displayOverlay));
                       }); // set up event listener for the search box
});