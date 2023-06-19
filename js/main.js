//Global re-usable functions for selecting any element
const selectElementByid = (id) => document.getElementById(id);

const getWordDetailsApi = async (word) => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const wordArray = await response.json();
    if (!wordArray.message) {
      displayWord(wordArray);
      displayError("");
    } else {
      throw new Error(wordArray.message);
    }
  } catch (error) {
    displayError(error.message);
    displayWord("CLEAR-ALL");
  }
};

//Error Displaying Function
const displayError = (errorMsg) =>
  (selectElementByid("error-container").innerText = errorMsg);

//Clear dictionary body
const clearDictionaryBody = () =>
  (selectElementByid("dictionary-body").innerHTML = "");

//Function for displaying word details
const displayWord = (wordArray) => {
  if (wordArray === "CLEAR-ALL") {
    const allHtml = document.querySelectorAll(".clear-html");
    allHtml.forEach((elem) => {
      elem.innerHTML = "";
    });
    return;
  }
  const wordObj = wordArray[0];
  console.log("Word Details: ", wordObj);
  selectElementByid("searched-word").innerText = wordObj.word;

  selectElementByid("search-word-pronunciation").innerText = wordObj.phonetic
    ? wordObj.phonetic
    : "Not Found";

  const audiosUrlArr = [];
  wordObj.phonetics.forEach((audioObj) => {
    if (audioObj.audio) {
      audiosUrlArr.push(audioObj.audio);
    }
  });
  selectElementByid("search-word-audio").innerHTML = `
  <audio controls>
  <source src="${audiosUrlArr[0]}" type="audio/mpeg">
  </audio>
  `;

  //Parts of speech
  const partsOfSpeechContainer = selectElementByid("partsOfSpeech-container");
  partsOfSpeechContainer.innerHTML = "";
  const partsOfSpeechH4 = document.createElement("h3");
  partsOfSpeechH4.innerText = "Parts of Speech";
  partsOfSpeechContainer.appendChild(partsOfSpeechH4);

  const headingAndList = selectElementByid("heading-and-list");

  headingAndList.innerHTML = "";
  wordObj.meanings.forEach((pOfs) => {
    headingAndList.innerHTML += `<h4>${pOfs.partOfSpeech}</h4>`;
    let ul = document.createElement("ul");
    pOfs.definitions.forEach((elem) => {
      ul.innerHTML += `<li>${elem.definition}</li>`;
    });
    headingAndList.appendChild(ul);
  });

  //Synonyms Displaying
  const synonymsContainerElem = selectElementByid("synonym-words-container");
  synonymsContainerElem.innerHTML = "";
  const synonymHeading = document.createElement("h4");
  synonymHeading.innerText = "Synonyms: ";
  synonymsContainerElem.appendChild(synonymHeading);
  wordObj.meanings.forEach((elem) => {
    elem.synonyms.forEach((synonym) => {
      synonymsContainerElem.innerHTML += `<span>  ${synonym}, </span>`;
    });
  });

  //Antonyms displaying
  const antonymsContainer = selectElementByid("antonyms-container");
  antonymsContainer.innerHTML = "";
  const antonymH4 = document.createElement("h4");
  antonymH4.innerText = "Antonyms: ";
  antonymsContainer.appendChild(antonymH4);

  //Loop through antonyms
  wordObj.meanings.forEach((elem) => {
    elem.antonyms.forEach(
      (antonym) => (antonymsContainer.innerHTML += `<span>${antonym}, </span>`)
    );
  });

  //Example Displaying
  const exampleContainer = selectElementByid("example-container");
  exampleContainer.innerHTML = "";
  const exampleH4 = document.createElement("h4");
  exampleH4.innerText = "Examples";
  exampleContainer.appendChild(exampleH4);
  const exampleUl = document.createElement("ul");
  exampleContainer.appendChild(exampleUl);
  //Loop through examples array
  wordObj.meanings.forEach((elem) => {
    elem.definitions.forEach((elem) => {
      elem.example ? (exampleUl.innerHTML += `<li>${elem.example}</li>`) : "";
    });
  });
};

// Event Listener
selectElementByid("search-btn").addEventListener("click", (ev) => {
  ev.preventDefault();
  const searchInputField = selectElementByid("search-input-field");
  const searchInputValue = searchInputField.value;
  if (!searchInputValue) {
    displayError("Please enter a valid word");
    return;
  }
  getWordDetailsApi(searchInputValue);
});
