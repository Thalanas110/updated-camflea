const step1 = document.querySelector(".step1"),
      step2 = document.querySelector(".step2"),
      step3 = document.querySelector(".step3"),
      emailAddress = document.getElementById("emailAddress"),
      verifyEmail = document.getElementById("verifyEmail"),
      inputs = document.querySelectorAll(".otp-group input");

const nextButton = document.getElementById("nextToOTP");
const verifyButton = document.getElementById("verifyOTP");  // Make sure this matches the correct button ID in HTML


let OTP="";
window.addEventListener("load", () => {
    emailjs.init("egGZmKxbrdb8WNJwe");
    step2.style.display = "none";
    step3.style.display = "none";
    nextButton.classList.add("disable");
});

const validateEmail = (email) => {
    let re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
        nextButton.classList.remove("disable");
    } else {
        nextButton.classList.add("disable");
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}
console.log(generateOTP());

inputs.forEach((input) => {
    input.addEventListener("keyup", function(e) {
if (this.value.length>=1) {
    e.target.value=e.target.value.substr(0, 1);
}

if(inputs[0].value !="" && inputs[1].value !="" && inputs[2].value !=""
    && inputs[3].value !="" && inputs[4].value !="" && inputs[5].value !=""
 ){
    verifyButton.classList.remove("disable");
 }else{
    verifyButton.classList.add("disable");
 }
    });
});

const serviceID = "service_g43re7f";
const templateID = "template_1t5qghj";
OTP=generateOTP();
nextButton.addEventListener("click", () => {
    nextButton.innerHTML="&#9889; Sending...";
    let templateParameter = {
        from_name: "CamFlea",
        OTP: OTP,
        message: "Please find out the attached file",
        reply_to: emailAddress.value,  // Fixed typo: "emailAdress" to "emailAddress"
    };

    emailjs.send(serviceID, templateID, templateParameter).then(
        (res) => {
            console.log(res);
            nextButton.innerHTML="Next &rarr;";
            step1.style.display="none";
            step2.style.display="block";
            step3.style.display="none";
        },
        (err) => {
            console.log(err);
        }
    );
});

verifyButton.addEventListener("click", ()=> {
    let values ="";
    inputs.forEach((input)=>{
        console.log(input.value)
        values+=input.value;
    })

    if(OTP == values) {
        step1.style.display="none";
        step2.style.display="none";
        step3.style.display="block";
    }else{
verifyButton.classList.add("error-shake");

setTimeout(()=> {
    verifyButton.classList.remove("error-shake");
},1000);
    
    }
});

function changeEmail() {
    step1.style.display="block";
    step2.style.display="none";
    step3.style.display="none";
}
