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

        var speech = new webkitSpeechRecognition();
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

                if (event.results[i].isFinal) {

                    final_transcript += event.results[i][0].transcript;

                } else {

                    interim_transcript += event.results[i][0].transcript;

                }
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

            transcription.innerHTML = ' ';
            interim_span.innerHTML = ' ';
            recognition = false;

        }

        window.addEventListener('keydown', function(e) {

            if (e.key === "q") {

                if (!recognition) {

                    speech.start(); // Starts speech Recording

                }
            }
        });

        window.addEventListener('keyup', function(e) {

            if (e.key === "q") {

                if (recognition) {

                    speech.stop();
                    //reset();

                }
            }
        });
    }
};
