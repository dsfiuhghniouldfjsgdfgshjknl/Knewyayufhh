// ==UserScript==
// @name         Kahoot Helper
// @version      1.0.25
// @namespace    https://github.com/jokeri2222
// @description  A helper for kahoot.it!
// @updateURL    https://github.com/jokeri2222/KaHack/raw/main/KaHack!.meta.js
// @downloadURL  https://github.com/jokeri2222/KaHack/raw/main/KaHack!.user.js
// @author       jokeri2222; https://github.com/jokeri2222
// @match        https://kahoot.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kahoot.it
// @grant        none
// ==/UserScript==
var Version = '1.0.25'

var questions = [];
var info = {
    numQuestions: 0,
    questionNum: -1,
    lastAnsweredQuestion: -1,
    defaultIL:true,
    ILSetQuestion:-1,
};
var PPT = 950;
var Answered_PPT = 950;
var autoAnswer = false;
var showAnswers = false;
var inputLag = 100;

function FindByAttributeValue(attribute, value, element_type)    {
  element_type = element_type || "*";
  var All = document.getElementsByTagName(element_type);
  for (var i = 0; i < All.length; i++)       {
    if (All[i].getAttribute(attribute) == value) { return All[i]; }
  }
}

const uiElement = document.createElement('div');
uiElement.className = 'kahoot-helper';
uiElement.style.position = 'absolute';
uiElement.style.top = '5%';
uiElement.style.left = '5%';
uiElement.style.width = '280px';
uiElement.style.height = 'auto';
uiElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
uiElement.style.borderRadius = '12px';
uiElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
uiElement.style.zIndex = '9999';
uiElement.style.border = '1px solid #e0e0e0';
uiElement.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
uiElement.style.opacity = '0.15';
uiElement.style.transition = 'all 0.3s ease';

const handle = document.createElement('div');
handle.className = 'helper-handle';
handle.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
handle.style.fontSize = '14px';
handle.textContent = 'Settings';
handle.style.color = 'rgba(51, 51, 51, 0.3)';
handle.style.width = 'calc(100% - 20px)';
handle.style.height = '32px';
handle.style.backgroundColor = 'rgba(245, 245, 245, 0.5)';
handle.style.borderRadius = '12px 12px 0 0';
handle.style.cursor = 'grab';
handle.style.textAlign = 'left';
handle.style.paddingLeft = '10px';
handle.style.paddingRight = '10px';
handle.style.lineHeight = '32px';
handle.style.borderBottom = '1px solid rgba(224, 224, 224, 0.3)';
handle.style.fontWeight = '500';
uiElement.appendChild(handle);

const closeButton = document.createElement('div');
closeButton.className = 'helper-close';
closeButton.textContent = '×';
closeButton.style.position = 'absolute';
closeButton.style.top = '0';
closeButton.style.right = '0';
closeButton.style.width = '32px';
closeButton.style.height = '32px';
closeButton.style.backgroundColor = 'transparent';
closeButton.style.color = 'rgba(102, 102, 102, 0.3)';
closeButton.style.borderRadius = '0 12px 0 0';
closeButton.style.display = 'flex';
closeButton.style.justifyContent = 'center';
closeButton.style.alignItems = 'center';
closeButton.style.cursor = 'pointer';
closeButton.style.fontSize = '18px';
closeButton.style.fontWeight = 'bold';
handle.appendChild(closeButton);

const contentArea = document.createElement('div');
contentArea.className = 'helper-content';
contentArea.style.padding = '15px';
contentArea.style.opacity = '0.3';
contentArea.style.transition = 'opacity 0.3s ease';
uiElement.appendChild(contentArea);

const inputContainer = document.createElement('div');
inputContainer.style.display = 'flex';
inputContainer.style.justifyContent = 'center';
inputContainer.style.marginBottom = '15px';

const inputBox = document.createElement('input');
inputBox.type = 'text';
inputBox.style.color = 'rgba(51, 51, 51, 0.5)';
inputBox.placeholder = 'Enter quiz code...';
inputBox.style.width = '100%';
inputBox.style.height = '32px';
inputBox.style.margin = '0';
inputBox.style.padding = '0 12px';
inputBox.style.border = '1px solid rgba(204, 204, 204, 0.3)';
inputBox.style.borderRadius = '6px';
inputBox.style.outline = 'none';
inputBox.style.textAlign = 'center';
inputBox.style.fontSize = '14px';
inputBox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
inputBox.style.boxSizing = 'border-box';

inputContainer.appendChild(inputBox);
contentArea.appendChild(inputContainer);

const settingsSection = document.createElement('div');
settingsSection.style.marginBottom = '15px';
contentArea.appendChild(settingsSection);

const pointsRow = document.createElement('div');
pointsRow.style.display = 'flex';
pointsRow.style.justifyContent = 'space-between';
pointsRow.style.alignItems = 'center';
pointsRow.style.marginBottom = '12px';
settingsSection.appendChild(pointsRow);

const pointsLabel = document.createElement('span');
pointsLabel.textContent = 'Points:';
pointsLabel.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
pointsLabel.style.fontSize = '14px';
pointsLabel.style.color = 'rgba(51, 51, 51, 0.4)';
pointsLabel.style.fontWeight = '500';
pointsRow.appendChild(pointsLabel);

const pointsValue = document.createElement('span');
pointsValue.textContent = '950';
pointsValue.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
pointsValue.style.fontSize = '14px';
pointsValue.style.color = 'rgba(51, 51, 51, 0.4)';
pointsValue.style.fontWeight = 'normal';
pointsRow.appendChild(pointsValue);

const pointsSlider = document.createElement('input');
pointsSlider.type = 'range';
pointsSlider.min = '500';
pointsSlider.max = '1000';
pointsSlider.value = '950';
pointsSlider.style.width = '100%';
pointsSlider.style.marginBottom = '15px';
pointsSlider.style.height = '4px';
pointsSlider.style.borderRadius = '2px';
pointsSlider.style.backgroundColor = 'rgba(221, 221, 221, 0.3)';
pointsSlider.style.outline = 'none';
pointsSlider.className = 'helper-slider';

pointsSlider.addEventListener('input', () => {
    const points = +pointsSlider.value;
    PPT = points;
    pointsValue.textContent = points.toString();
});

settingsSection.appendChild(pointsSlider);

const switchesContainer = document.createElement('div');
switchesContainer.style.display = 'flex';
switchesContainer.style.flexDirection = 'column';
switchesContainer.style.gap = '10px';
contentArea.appendChild(switchesContainer);

const autoAnswerRow = document.createElement('div');
autoAnswerRow.style.display = 'flex';
autoAnswerRow.style.justifyContent = 'space-between';
autoAnswerRow.style.alignItems = 'center';
switchesContainer.appendChild(autoAnswerRow);

const autoAnswerLabel = document.createElement('span');
autoAnswerLabel.textContent = 'Auto Answer';
autoAnswerLabel.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
autoAnswerLabel.style.fontSize = '14px';
autoAnswerLabel.style.color = 'rgba(51, 51, 51, 0.4)';
autoAnswerRow.appendChild(autoAnswerLabel);

const autoAnswerSwitch = document.createElement('label');
autoAnswerSwitch.className = 'helper-switch';
autoAnswerRow.appendChild(autoAnswerSwitch);

const autoAnswerInput = document.createElement('input');
autoAnswerInput.type = 'checkbox';
autoAnswerInput.addEventListener('change', function() {
    autoAnswer = this.checked;
    info.ILSetQuestion = info.questionNum
});
autoAnswerSwitch.appendChild(autoAnswerInput);

const autoAnswerSlider = document.createElement('span');
autoAnswerSlider.className = 'helper-slider-round';
autoAnswerSwitch.appendChild(autoAnswerSlider);

const showAnswersRow = document.createElement('div');
showAnswersRow.style.display = 'flex';
showAnswersRow.style.justifyContent = 'space-between';
showAnswersRow.style.alignItems = 'center';
switchesContainer.appendChild(showAnswersRow);

const showAnswersLabel = document.createElement('span');
showAnswersLabel.textContent = 'Show Hints';
showAnswersLabel.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
showAnswersLabel.style.fontSize = '14px';
showAnswersLabel.style.color = 'rgba(51, 51, 51, 0.4)';
showAnswersRow.appendChild(showAnswersLabel);

const showAnswersSwitch = document.createElement('label');
showAnswersSwitch.className = 'helper-switch';
showAnswersRow.appendChild(showAnswersSwitch);

const showAnswersInput = document.createElement('input');
showAnswersInput.type = 'checkbox';
showAnswersInput.addEventListener('change', function() {
    showAnswers = this.checked;
});
showAnswersSwitch.appendChild(showAnswersInput);

const showAnswersSlider = document.createElement('span');
showAnswersSlider.className = 'helper-slider-round';
showAnswersSwitch.appendChild(showAnswersSlider);

const infoSection = document.createElement('div');
infoSection.style.marginTop = '15px';
infoSection.style.padding = '12px';
infoSection.style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
infoSection.style.borderRadius = '6px';
infoSection.style.border = '1px solid rgba(233, 236, 239, 0.3)';
contentArea.appendChild(infoSection);

const questionsLabel = document.createElement('div');
questionsLabel.textContent = 'Question: 0/0';
questionsLabel.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
questionsLabel.style.fontSize = '13px';
questionsLabel.style.color = 'rgba(102, 102, 102, 0.4)';
questionsLabel.style.marginBottom = '5px';
infoSection.appendChild(questionsLabel);

const inputLagLabel = document.createElement('div');
inputLagLabel.textContent = 'Timing: 125ms';
inputLagLabel.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
inputLagLabel.style.fontSize = '13px';
inputLagLabel.style.color = 'rgba(102, 102, 102, 0.4)';
infoSection.appendChild(inputLagLabel);

const versionLabel = document.createElement('div');
versionLabel.textContent = 'Helper v' + Version;
versionLabel.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
versionLabel.style.fontSize = '12px';
versionLabel.style.color = 'rgba(153, 153, 153, 0.4)';
versionLabel.style.textAlign = 'center';
versionLabel.style.marginTop = '15px';
contentArea.appendChild(versionLabel);

const style = document.createElement('style');
style.textContent = `
.helper-slider {
    -webkit-appearance: none;
    appearance: none;
    background: rgba(221, 221, 221, 0.3);
    border-radius: 2px;
    height: 4px;
    opacity: 0.3;
    transition: all 0.3s ease;
}

.helper-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: rgba(70, 23, 143, 0.3);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    opacity: 0.3;
    transition: all 0.3s ease;
}

.helper-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: rgba(70, 23, 143, 0.3);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    opacity: 0.3;
    transition: all 0.3s ease;
}

.helper-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    opacity: 0.3;
    transition: all 0.3s ease;
}

.helper-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.helper-slider-round {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(204, 204, 204, 0.3);
    transition: .2s;
    border-radius: 24px;
}

.helper-slider-round:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: rgba(255, 255, 255, 0.7);
    transition: .2s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input:checked + .helper-slider-round {
    background-color: rgba(70, 23, 143, 0.3);
}

input:checked + .helper-slider-round:before {
    transform: translateX(20px);
}

.helper-close:hover {
    background-color: rgba(255, 68, 68, 0.3);
    color: rgba(255, 255, 255, 0.7);
}

.kahoot-helper:hover {
    opacity: 0.95 !important;
    background-color: rgba(255, 255, 255, 0.98);
}

.kahoot-helper:hover .helper-content {
    opacity: 1;
}

.kahoot-helper:hover .helper-close {
    color: rgba(102, 102, 102, 0.8);
}

.kahoot-helper:hover .helper-handle {
    color: rgba(51, 51, 51, 0.9);
    background-color: rgba(245, 245, 245, 0.9);
}

.kahoot-helper:hover .helper-slider,
.kahoot-helper:hover .helper-switch {
    opacity: 1;
}

.kahoot-helper:hover input,
.kahoot-helper:hover span {
    color: rgba(51, 51, 51, 0.9);
}

.kahoot-helper:hover .helper-slider {
    background: rgba(221, 221, 221, 0.8);
}

.kahoot-helper:hover .helper-slider::-webkit-slider-thumb {
    background: rgba(70, 23, 143, 0.8);
    opacity: 1;
}

.kahoot-helper:hover .helper-slider::-moz-range-thumb {
    background: rgba(70, 23, 143, 0.8);
    opacity: 1;
}

.kahoot-helper:hover .helper-slider-round {
    background-color: rgba(204, 204, 204, 0.8);
}

.kahoot-helper:hover input:checked + .helper-slider-round {
    background-color: rgba(70, 23, 143, 0.8);
}
`;
document.head.appendChild(style);

closeButton.addEventListener('click', () => {
    document.body.removeChild(uiElement);
    autoAnswer = false;
    showAnswers = false;
});

let isMinimized = false;

handle.addEventListener('click', (e) => {
    if (e.target !== closeButton) {
        isMinimized = !isMinimized;
        if (isMinimized) {
            contentArea.style.display = 'none';
            uiElement.style.height = '32px';
            handle.style.borderRadius = '12px';
        } else {
            contentArea.style.display = 'block';
            uiElement.style.height = 'auto';
            handle.style.borderRadius = '12px 12px 0 0';
        }
    }
});

function parseQuestions(questionsJson){
    let questions = []
    questionsJson.forEach(function (question){
    let q = {type:question.type, time:question.time}
    if (['quiz', 'multiple_select_quiz'].includes(question.type)){
        var i=0
        q.answers = []
        q.incorrectAnswers = []
        question.choices.forEach(function(choise){
            if (choise.correct) {
                q.answers.push(i)
            }
            else{
                q.incorrectAnswers.push(i)
            }
            i++
        })
    }
    if (question.type == 'open_ended')
    {
        q.answers = []
        question.choices.forEach(function(choise){
            q.answers.push(choise.answer)
        })
    }
    questions.push(q)
})
    return questions
}

function handleInputChange() {
    const quizID = inputBox.value;
    const url = 'https://kahoot.it/rest/kahoots/' + quizID;

    if (quizID != "") {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
            .then(data => {
                inputBox.style.borderColor = 'rgba(40, 167, 69, 0.3)';
                inputBox.style.backgroundColor = 'rgba(248, 255, 249, 0.5)';

                questions=parseQuestions(data.questions)
                info.numQuestions=questions.length
            })
            .catch(error => {
                inputBox.style.borderColor = 'rgba(220, 53, 69, 0.3)';
                inputBox.style.backgroundColor = 'rgba(255, 248, 248, 0.5)';

                info.numQuestions = 0
            });
    } else {
        inputBox.style.borderColor = 'rgba(204, 204, 204, 0.3)';
        inputBox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        info.numQuestions = 0

    }
}

inputBox.addEventListener('input', handleInputChange);

document.body.appendChild(uiElement);

let isDragging = false;
let offsetX, offsetY;

handle.addEventListener('mousedown', (e) => {
    if (e.target === closeButton) return;
    isDragging = true;
    offsetX = e.clientX - uiElement.getBoundingClientRect().left;
    offsetY = e.clientY - uiElement.getBoundingClientRect().top;
    handle.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        uiElement.style.left = x + 'px';
        uiElement.style.top = y + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    handle.style.cursor = 'grab';
});


function onQuestionStart(){
    console.log(inputLag)
    var question = questions[info.questionNum]
    if (showAnswers){
        highlightAnswers(question)
    }
    if (autoAnswer){
        answer(question, (question.time - question.time / (500/(PPT-500))) - inputLag)
    }
}

function highlightAnswers(question){
    // Remove any existing dots first
    removeAnswerDots();
    
    question.answers.forEach(function (answer) {
        setTimeout(function() {
            const answerButton = FindByAttributeValue("data-functional-selector", 'answer-'+answer, "button");
            if (answerButton) {
                // Create a subtle white dot
                const dot = document.createElement('div');
                dot.className = 'answer-hint';
                dot.style.position = 'absolute';
                dot.style.width = '6px';
                dot.style.height = '6px';
                dot.style.backgroundColor = 'white';
                dot.style.borderRadius = '50%';
                dot.style.zIndex = '1000';
                dot.style.boxShadow = '0 0 2px rgba(0,0,0,0.3)';
                
                // Position the dot randomly but consistently for each answer
                const positions = [
                    { top: '8px', left: '8px' },
                    { top: '8px', right: '8px' },
                    { bottom: '8px', left: '8px' },
                    { bottom: '8px', right: '8px' }
                ];
                
                const pos = positions[answer % positions.length];
                Object.assign(dot.style, pos);
                
                answerButton.style.position = 'relative';
                answerButton.appendChild(dot);
            }
        }, 0)
    })
}

function removeAnswerDots() {
    // Remove any existing dots from previous questions
    const existingDots = document.querySelectorAll('.answer-hint');
    existingDots.forEach(dot => {
        dot.remove();
    });
}

function answer(question, time) {
    Answered_PPT = PPT
    
    var delay = 0
    if (question.type == 'multiple_select_quiz') delay = 60
    setTimeout(function() {
        if (question.type == 'quiz') {
            const key=(+question.answers[0]+1).toString();
            const event = new KeyboardEvent('keydown', { key });
            window.dispatchEvent(event);
        }
        if (question.type == 'multiple_select_quiz') {
            question.answers.forEach(function (answer) {
                setTimeout(function() {
                    const key=(+answer+1).toString();
                    const event = new KeyboardEvent('keydown', { key });
                    window.dispatchEvent(event);
                        }, 0)
                    })
            setTimeout(function() {
               FindByAttributeValue("data-functional-selector", 'multi-select-submit-button', "button").click()
            }, 0)
        }
    }, time - delay)
}

let isHidden = false;
document.addEventListener('keydown', (event)=> {
    if (event.key == "h"  && event.altKey)
    {
        isHidden = !isHidden
        uiElement.style.display = isHidden ? 'none' : 'block';
    }

    if (event.key == "x" && event.altKey){
        document.body.removeChild(uiElement);
        autoAnswer = false;
        showAnswers = false;
    }
})

setInterval(function () {
    var textElement = FindByAttributeValue("data-functional-selector", "question-index-counter", "div")
    if (textElement){
        
        info.questionNum = +textElement.textContent - 1
    }
    if (FindByAttributeValue("data-functional-selector", 'answer-0', "button") && info.lastAnsweredQuestion != info.questionNum) 
    {
        info.lastAnsweredQuestion = info.questionNun
        onQuestionStart()
    }
    if (autoAnswer){
        if (info.ILSetQuestion != info.questionNum){
            var ppt = Answered_PPT
            if (ppt > 987) ppt = 1000
            var incrementElement = FindByAttributeValue("data-functional-selector", "score-increment", "span")
            if (incrementElement){
                info.ILSetQuestion = info.questionNum
                var increment = +incrementElement.textContent.split(" ")[1]
                if (increment != 0){
                    inputLag += (ppt-increment)*15
                    if (inputLag < 0) {
                        inputLag -= (ppt-increment)*15
                        inputLag += (ppt-increment/2)*15
                    }
                    inputLag = Math.round(inputLag)
                }
            }
        }
    }
    questionsLabel.textContent = 'Question: '+(info.questionNum+1)+'/'+info.numQuestions;
    inputLagLabel.textContent = 'Timing: '+inputLag+'ms';
}, 1)
