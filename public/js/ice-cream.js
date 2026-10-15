document.getElementById("order-form").onsubmit = () => {

    // reset error messages and validation
    clearErrorMessages();
    var isValid = true;

    let inputName = document.getElementById("name").value.trim();
    if (inputName === "") {                                             // name validation
        document.getElementById("err-name").style.display = "block";    // if fail: display error message
        isValid = false;                                                // mark entire form as invalid until next submit
    }
    let email = document.getElementById("email").value.trim();          
    if (email === "" || !email.includes("@")) {                         // email validation
        document.getElementById("err-email").style.display = "block";   // if fail: display error message
        isValid = false;                                                // mark entire form as invalid until next submit
    }
    let flavor = document.getElementById("flavor").value;
    if (flavor == "none") {                                             // check if a valid option was selected
        document.getElementById("err-flavor").style.display = "block";  // if fail: display error message
        isValid = false;                                                // mark entire form as invalid until next submit
    }
    let coneSelected = false;                                           // cone validation
    let coneOptions = document.getElementsByName("cone");               // fetch status of options
    for (let i = 0; i < coneOptions.length; i++) {                      // loop through options
        if (coneOptions[i].checked)                                     // if an option is selected
            coneSelected = true;                                        // confirm validity
    }
    if (!coneSelected) {                                                // check if validity confirmed
        document.getElementById("err-cone").style.display = "block";    // if fail: display error message
        isValid = false;                                                // mark entire form as invalid until next submit
    }
    
    return isValid;                                                     // submit only if data was valid
}

function clearErrorMessages() {
    let errors = document.getElementsByClassName("err");    // select all error messages
    for (let i = 0; i < errors.length; i++) {               // for each message
        errors[i].style.display = "none";                   // set as invisible
    }
}