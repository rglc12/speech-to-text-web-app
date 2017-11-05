var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

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
            interim_span.innerHTML = '';
            recognition = false;

        }

        window.addEventListener('keydown', function(e) {

            if (e.key === "q") {

                if (!recognition) {

                    speech.start(); // Starts speech Recording, but after 3 seconds of no sound, the sentence will end.

                }
            }
        });

        window.addEventListener('keyup', function(e) {

            if (e.key === "q") {

                if (recognition) {

                    speech.stop(); // Ends the speech Recording
                    reset();

                }
            }
        });
    }
};
