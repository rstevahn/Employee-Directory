/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * app.js */

/*jshint esversion: 6 */

// First, let's wait for the page to load

window.addEventListener ('DOMContentLoaded', () => {

    let studentData = []; // the student data received. used for searching and for the modal dialog data
    let studentCards = ""; // the HTML we will generate based on the student data received

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
    //  Function to generate the html for the
    //  gallery items
    //  params: results array
    //  returns: innerHTML for the gallery div
    // ------------------------------------------
    
    function generateCards(data) {
        const studentDivs = data.map(student => 
            `<div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${student.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${student.name.first} ${student.name.last}</h3>
                    <p class="card-text">${student.email}</p>
                    <p class="card-text cap">${student.location.city}, ${student.location.state}</p>
                </div>
            </div>`).join("");
        return studentDivs;
    }

    // --------------------------------------------
    //
    // Main Program
    //
    // --------------------------------------------
 
    fetchData('https://randomuser.me/api/?results=12&nat=us&inc=name,email,location,phone,dob,picture')
        .then((data) => {studentData = data; // save the data for searching and for the modal dialog
                         studentCards = generateCards(data.results);}) // generate the cards
        .catch(err => studentCards = `<div class="card"><h3>An error has occurred:</h3><h4>${err}</h4></div>`)
        .finally(() => document.getElementById('gallery').innerHTML = studentCards); // display the cards

});
