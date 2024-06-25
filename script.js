const API = "https://api.dictionaryapi.dev/api/v2/entries/en/<word>";
const search = document.querySelector(".searchInput");
const searchIcon = document.querySelector(".searchBar");
const pos = document.querySelector(".partOfSpeech");
const wordElement = document.querySelector(".name");
const pronounce = document.querySelector(".pronounciation p");
const define = document.querySelector(".meaning ul");
const example = document.querySelector(".examples ul");
const synonym = document.querySelector(".synonyms ul");
const antonym = document.querySelector(".antonyms ul");
const btnSubmit = document.querySelector("#btnSubmit");
const input = document.getElementById("input");

// Default function 
function init() {
    pos.innerHTML = "";
    wordElement.innerHTML = "";
    pronounce.innerHTML = "";
    define.innerHTML = "";
    example.innerHTML = "";
    synonym.innerHTML = "";
    antonym.innerHTML = "";
    document.querySelector(".meaning").classList.remove("active");
    document.querySelector(".examples").classList.remove("active");
    document.querySelector(".synonyms").classList.remove("active");
    document.querySelector(".antonyms").classList.remove("active");
    document.querySelector(".mainSection").style.display = "none";
}



// Fetch data from API
async function fetchData(word) {
    try {
        const response = await fetch(API.replace('<word>', word));
        const data = await response.json();
        console.log(data); // Debugging: Log the response data
        if (data.title === "No Definitions Found") {
            alert("No definitions found for the entered word.");
            return;
        }
        getData(data);
    } catch (error) {
        console.log("Error:", error);
    }
}

// Get data from API
function getData(data) {
    init();
    if (data.length > 0) {
        const entry = data[0];
        pos.innerText = entry.meanings[0].partOfSpeech;
        wordElement.textContent = entry.word;
        pronounce.innerText = entry.phonetic || (entry.phonetics.length > 0 ? entry.phonetics[0].text : "");

        // Definitions
        let definitionList = "";
        entry.meanings[0].definitions.forEach(definition => {
            definitionList += `<li>${definition.definition}</li>`;
        });
        define.innerHTML = definitionList;
        if (definitionList) {
            document.querySelector(".meaning").classList.add("active");
            document.querySelector(".examples").classList.remove("active");
            document.querySelector(".synonyms").classList.remove("active");
            document.querySelector(".antonyms").classList.remove("active");
        }

        // Examples
        let exampleList = "";
        entry.meanings[0].definitions.forEach(definition => {
            if (definition.example) {
                exampleList += `<li>${definition.example}</li>`;
            }
        });
        example.innerHTML = exampleList;
        if (exampleList) {
            document.querySelector(".examples").classList.add("active");
            document.querySelector(".synonyms").classList.remove("active");
        }

        // Synonyms
        let synonymList = '';
        if (entry.meanings[0].synonyms) {
            entry.meanings[0].synonyms.forEach(synonymItem => {
                synonymList += `<li>${synonymItem}</li>`;
            });
            synonym.innerHTML = synonymList;
            if (synonymList) {
                document.querySelector(".synonyms").classList.add("active");
            }
        }

        // Antonyms
        let antonymList = '';
        if (entry.meanings[0].antonyms) {
            entry.meanings[0].antonyms.forEach(antonymItem => {
                antonymList += `<li>${antonymItem}</li>`;
            });
            antonym.innerHTML = antonymList;
            if (antonymList) {
                document.querySelector(".antonyms").classList.add("active");
            }
        }

        // Display main section
        document.querySelector(".mainSection").style.display = "block";
    } else {
        console.error("No data found for the word:", word);
    }
}

// Event Listeners 
btnSubmit.addEventListener("click", function () {
    if (input.value.trim() === "") {
        alert("Please enter a word to search");
    } else {
        fetchData(input.value);
    }
});

input.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        if (input.value.trim() === "") {
            alert("Please enter a word to search");
        } else {
            fetchData(input.value);
        }
    }
}, false);
