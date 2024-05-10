const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),  
selectTag = document.querySelectorAll("select"),
translateBtn = document.querySelector("button"),
exchangeIcon = document.querySelector(".exchange"),
icons = document.querySelectorAll(".row i");


selectTag.forEach((tag,id) => {
    for(const country_code in countries){
        //selecting English as from language and Hindi as to language as default
        let selected;
        if(id == 0 && country_code == "en-GB"){
            selected = "selected";
        }
        else if(id == 1 && country_code == "hi-IN"){
            selected = "selected";
        }

        let option =  `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend",option);
    }
});
// swapping the content of either side if needed
exchangeIcon.addEventListener("click",() =>{
    let tempText = fromText.value;
    tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    fromText.value = toText.value;
    selectTag[1].value = tempLang;
    toText.value = tempText;
})

translateBtn.addEventListener("click", () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value,//getting from select tag value
    translateTo = selectTag[1].value;//getting to select tag value
    if(!text) return;
    toText.setAttribute("placeholder","Translating..");

    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    //fetching api response and returning it with parsing into js obj and another then method receives that obj
    fetch(apiURL).then(res =>res.json()).then(data =>{

        toText.value = data.responseData.translatedText;
    });

});

icons.forEach(icon =>{
    icon.addEventListener("click",({target}) =>{
        if(target.classList.contains("fa-copy")){
            if(target.id == "from"){
                navigator.clipboard.writeText(fromText.value);//from side clipboard icon will copy the from content
            }
            else{
                navigator.clipboard.writeText(toText.value);//to side clipboard icon will copy the to content
            }
        }

        else{

            let utterance;
            //the content of it's end is assigned to the sound obj when the target id is matched as either from or to
            if(target.id == "from"){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;//setting the speech sound to from side selected language
            }
            else{
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;//setting the speech sound to to side selected language
            }
            speechSynthesis.speak(utterance);//the clicked icon for speech will work with speaking out the content in it's end
        }
    });
});