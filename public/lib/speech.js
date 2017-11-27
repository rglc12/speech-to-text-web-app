var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var socket = io("http://localhost:3000");

socket.on("connect", function(){

    console.log("working");

});

socket.on("disconnect", function(){

    console.log("Not working");

});


function upgrade() { //An Alert will run to help the user get the best experience using this WebApp

    alert('Please use Google Chrome for best experience');

}

window.onload = function() {

    if (!(window.SpeechRecognition)) {

        upgrade();

    } else {

        var recognition;
        var transcription = document.getElementById('speech');
        var interim_span = document.getElementById('interim');
        var final_transcript = ''; // Set as Global to make sure the text stays in the span

        var speech = new webkitSpeechRecognition(); // Construct the Speech Recognition API
        speech.continuous = true; // Display more than one word
        speech.interimResults = true; // Display words as you say them
        speech.lang = 'en-UK'; // Allows the API to know what Language you intend to use

        transcription.innerHTML = localStorage.getItem('transcript');

        socket.on("message", function(){

            reset();

        });

        speech.onstart = function() {

            // When recognition begins
            recognition = true;

        };
        speech.onresult = function(event) {
            // When recognition produces result
            var interim_transcript = '';

            // The Loop to record the results of the recording
            for (var i = event.resultIndex; i < event.results.length; ++i) {

                if (event.results[i].isFinal) { //.isFinal implies that the recording has stopped for the time being and is making a commit to the <span>

                    final_transcript += event.results[i][0].transcript + '. '; // At the end of each 'sentence', a fullstop with be put there by default.
                    localStorage.setItem('transcript', final_transcript); //Stores transcript to local storage so that the user doesn't have to press 'End Recording' to do so.

                } else {

                    interim_transcript += event.results[i][0].transcript;

                } //.transcript is the return value/string from the result of the recording.
            }

            transcription.innerHTML = final_transcript;
            interim_span.innerHTML = interim_transcript;

        };

        speech.onerror = function(e) {

            // error handling
            console.error(e.error);

        };

        speech.onend = function() {

            // When recognition ends
            reset();

        };

        function reset() {

            /*
                Setting the innHTML to final_transcript to keep the text on screen.
            */
            transcription.innerHTML = final_transcript;
            //socket.emit("transcipt", final_transcript);
            interim_span.innerHTML = '';
            recognition = false;

        }

        /*

            Commands to start the recording.

         */

        document.getElementById("start").addEventListener("click", function(){

            if (!recognition) {

                speech.start(); // Starts speech Recording, but after 3 seconds of no sound, the sentence will end.

            }
            console.log("start recording");

        });

        window.addEventListener('keydown', function(e) {

            if (e.key === "q") {

                if (!recognition) {

                    speech.start(); // Starts speech Recording, but after 3 seconds of no sound, the sentence will end.

                }
            }
        });

        /*

         Commands to end the recording.

         */

        document.getElementById("end").addEventListener("click", function(){

            if (recognition) {

                speech.stop(); // Ends the speech Recording
                reset();
                localStorage.setItem('transcript', final_transcript); //Stores text to local storage

            }

            console.log("end recording");

        });

        window.addEventListener('keyup', function(e) {

            if (e.key === "e") {

                if (recognition) {

                    speech.stop(); // Ends the speech Recording
                    reset();
                    localStorage.setItem('transcript', final_transcript);


                }
            }
        });


        /*

            The Accessibility part with the magnification of the text.

         */

        var mag150 = document.getElementById("mag150");
        var mag200 = document.getElementById("mag200");

        mag150.addEventListener("click", function () {

            document.getElementById("transcriptionText").style.fontSize = "33px";

        });

        mag200.addEventListener("click", function () {

            document.getElementById("transcriptionText").style.fontSize = "44px";

        });

        /*

            Resetting the text to a blank div.

         */

        document.getElementById("reset").addEventListener("click", function () {

            transcription.innerHTML = "";
            interim_span.innerHTML = "";
            localStorage.clear();

        })

    }
};
