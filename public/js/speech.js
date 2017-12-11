var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


/*
    Creating the connection to the WebSocket
 */

var socket = io("http://localhost:8080");

socket.on("connect", function(){

    console.log("You are Connected!");

});

socket.on("disconnect", function(){

    console.log("You have been Disconnected!");

});


function upgrade() { //An Alert will run to help the user get the best experience using this WebApp

    alert('Please use Google Chrome for best experience');

}

/*
    The following code takes the first letter of each 'Sentence' (i.e. the first character in the span or
    the first letter after a full stop) and capitalises it.

    Reference: https://stackoverflow.com/questions/40669216/capitalize-words-after-each-dot-starting-of-a-string
 */

function sentenceCase(input, lowercaseBefore) {
    input = ( input === undefined || input === null ) ? '' : input;
    if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. *)([a-z])/g, function(match, separator, char) {
        return separator + char.toUpperCase();
    });
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

        transcription.innerHTML = localStorage.getItem('transcript'); // Retrieving the locally store transcript to be rendered from the user's previous session

        /*
            Code for the data transmission to the server.
         */
        socket.on('transcript', function(data){ // Waiting for a 'transcript' message and it's data from the server

            transcription.innerHTML = data;

        });

        socket.on('interim', function(data){ // Waiting for a 'interim' message and it's data from the server

            interim_span.innerHTML = data;

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
                    final_transcript = sentenceCase(final_transcript); // Capitalise the first letter of each sentence
                    localStorage.setItem('transcript', final_transcript); //Stores transcript to local storage so that the user doesn't have to press 'End Recording' to do so.

                    /*
                        The server will receive a 'transcript' message from the client with will be broadcasted over all connected devices.
                        The prior 'interim' message will be erased to stop a constant stream of interim text
                     */
                    socket.emit('transcript', final_transcript);
                    socket.emit('interim', '');

                } else {

                    interim_transcript += event.results[i][0].transcript;

                    /*
                        The server will receive a 'interim' message (showing the text the API is trying to transcribe)
                        from the client with will be broadcasted over all connected devices.
                     */
                    socket.emit('interim', interim_transcript);


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
            interim_span.innerHTML = '';
            recognition = false;

        }

        // Listing all Functional Buttons

        var start = document.getElementById("start");
        var startBut = document.getElementById("startIcon");
        var end = document.getElementById("end");
        var endBut = document.getElementById("endIcon");
        var mag150 = document.getElementById("mag150");
        var OrgMagIcon = document.getElementById("mag150Icon");
        var mag200 = document.getElementById("mag200");
        var mag200Icon = document.getElementById("mag200Icon");
        var resetBut = document.getElementById("reset");
        var resetIcon = document.getElementById("resetIcon");

        /*
         Commands to start the recording.
         */

        start.addEventListener("click", function(){

            if (!recognition) {

                speech.start(); // Starts speech Recording, but after 3 seconds of no sound, the sentence will end.

            }
            console.log("start recording");
        });

        startBut.addEventListener("click", function(){

            if (!recognition) {

                speech.start(); // Starts speech Recording, but after 3 seconds of no sound, the sentence will end.

            }
            console.log("start recording");
        });

        /*
            Commands to end the recording.
         */

        end.addEventListener("click", function(){

            if (recognition) {

                speech.stop(); // Ends the speech Recording
                reset();
                localStorage.setItem('transcript', final_transcript); //Stores text to local storage

            }

            console.log("end recording");

        });

        endBut.addEventListener("click", function(){

            if (recognition) {

                speech.stop(); // Ends the speech Recording
                reset();
                localStorage.setItem('transcript', final_transcript); //Stores text to local storage

            }

            console.log("end recording");

        });

        /*
            The Accessibility part with the magnification of the text.
         */

        mag150.addEventListener("click", function () {

            document.getElementById("transcriptionText").style.fontSize = "33px";

        });

        OrgMagIcon.addEventListener("click", function () {

            document.getElementById("transcriptionText").style.fontSize = "22px";

        });

        mag200.addEventListener("click", function () {

            document.getElementById("transcriptionText").style.fontSize = "44px";

        });

        mag200Icon.addEventListener("click", function () {

            document.getElementById("transcriptionText").style.fontSize = "44px";

        });

        /*
            Resetting the text to a blank div.
         */

        resetBut.addEventListener("click", function () {

            transcription.innerHTML = "";
            interim_span.innerHTML = "";
            localStorage.clear();

        });

        resetIcon.addEventListener("click", function () {

            transcription.innerHTML = "";
            interim_span.innerHTML = "";
            localStorage.clear();

        });

    }
};
