window.Backend = "http://localhost:8085"

let speech = 'i like to finger my sweet sweet ass';

async function GetWordCloud(speech){
    return new Promise(async (resolve, reject)=>{
        await axios.post('https://quickchart.io/wordcloud?text='+speech)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
        console.log(resolve);
    })
}

GetWordCloud(speech);

$('.main-link').on('click', function () {
    window.location.replace("entry.html");
})
$('.authorization').on('click', function () {
    window.location.replace("authorization.html");
})
$('.registration').on('click', function () {
    window.location.replace("registration.html");
})
let itemId = 1;
let existingPresentations = document.querySelectorAll('.presItem');
renewPres();
$('.create').on("click", function () {
    itemId++;
    let presItem = document.createElement('div');
    presItem.className = 'presItem';
    presItem.innerHTML = '<img src="assets/pres.svg" alt="pres" class="window" data-id="'+itemId+'"><div class="title">Презентация №'+itemId+'</div>'
    document.querySelector('.presList').appendChild(presItem);
    renewPres();
})

function renewPres(){
    existingPresentations = document.querySelectorAll('.presItem');
    // $(existingPresentations).on('click', function (){
    //     console.log('her');
    //     window.location.replace("index.html?"+itemId);
    // })
    existingPresentations.forEach( element => {
        let id = $(this).find('img').attr('data-id');
        $(element).find('.title').on('click', function (){
            window.location.replace('index.html?'+id);
        })
    })
}


// Добавить опцию
function addOption() {
    let option = document.createElement('div');
    option.className = 'optionItem';
    option.innerHTML = '<input class="form-control" type="text" placeholder="Вариант">'
    document.querySelector('.optionItems').appendChild(option);
}

$('.addOption').on('click', function (){
    addOption();
});


// Получение презентации по id
async function GetPresentation(presentationID) {
    return new Promise(async (resolve, reject) => {
        await axios.get(window.Backend + '/api/presentation/' + presentationID)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

// Сохранение презентации
async function SavePresentation(presentationID = null, activeSlide = null, presentationName = "", slides = []) {
    return new Promise(async (resolve, reject) => {
        await axios.post(window.Backend + '/api/presentation/save', {
            name: presentationName,
            status: "active",
            activeSlide: activeSlide,
            presentationID: presentationID,
            slides: [
                {
                    id: 1,
                    question: "How many?",
                    chartsId: 'bar',
                    answers: [
                        {
                            id: 1,
                            text: "Ты пидр?"
                        },
                        {
                            id: 2,
                            text: "Он пидр?"
                        },
                        {
                            id: 3,
                            text: "Они пидр?"
                        }
                    ]
                }
            ]
        })
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

// Получить результаты для графиков
async function GetChartsResult(id_slide, id_presentation) {
    return new Promise(async (resolve, reject) => {
        await axios.post(window.Backend + '/api/results', {
            id_slide: id_slide,
            id_presentation: id_presentation
        })
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}


function NewSLide(id, question, chartsID, answers) {
    this.id = id;
    this.question = question;
    this.chartsID = chartsID;
    this.answers = answers;
}

function NewAnswer(id, text) {
    this.id = id;
    this.text = text;
}

let id = 1;
let slideList = [];
let index = 0;
let activeSlideId;
let chart;

//<i class="gg-trash"></i>

function addSlide() {
    let newGraph = new NewSLide(id);
    activeSlideId = id;
    let miniSlide = document.createElement('div');
    miniSlide.className = 'slideMini';
    miniSlide.innerHTML = '<div class="info"><p class="number" data-id="' + id + '">' + id + '</p> <button class="remove" data-id="' + id + '"></button></div> <div class="pic"></div>'
    document.querySelector('.slideList').appendChild(miniSlide);
    slideList[index] = newGraph;
    index++;
    id++;
    return newGraph;
}
if (window.location.href.indexOf("index") > -1){
    addSlide();
}

let existingSlides = document.querySelectorAll('.slideMini');

$('.addSlide').on('click', function (){
    addSlide();
    renewSlides();
    rewriteContent(activeSlideId);
    clearFields();
});

let presentationId = 1;

$('input[type=radio]').on('click',function (){
    $('input[type=radio]').parent().removeClass('activeIcon');
    $(this).parent().addClass('activeIcon');
    label.style.color = 'blue';
})

$('.contentBtn').on('click', function (){
    $(this).addClass('btn-dark');
    $(this).removeClass('btn-secondary');
    $('.graphBtn').addClass('btn-secondary').removeClass('btn-dark');
    $('.graphs').hide();
    $('.content').show();
})

$('.graphBtn').on('click', function (){
    $(this).addClass('btn-dark');
    $(this).removeClass('btn-secondary');
    $('.contentBtn').addClass('btn-secondary').removeClass('btn-dark');
    $('.graphs').show();
    $('.content').hide();
})

let loadFile = function (event){
    if (chart) {
        chart.destroy();
    }
    let slidePic = document.createElement('div');
    slidePic.className = 'slidePic';
    slidePic.innerHTML = '<img src="" id="output" alt="picture">'
    document.querySelector('#chart').appendChild(slidePic)
    let image = document.querySelector('#output');
    image.src = URL.createObjectURL(event.target.files[0]);
    document.querySelector('.slideTitle').innerHTML = document.querySelector('#question').value;
    let answers = [];
    answers[0] = new NewAnswer();
    answers[0].id = 0;
    answers[0].text = URL.createObjectURL(event.target.files[0]);
    console.log(answers);
    slideList[activeSlideId-1].answers = answers;
    slideList[activeSlideId-1].chartsID = 'image';
    slideList[activeSlideId-1].question = document.querySelector('#question').value;
}


$('.createGraph').on('click', function (){
    let chosenOptions = '';
    let options = '';
    let pieOptions = '';
    let areaOptions = '';
    let radarOptions = '';
    let polarOptions = '';
    let optionsData = '';
    let chartType = '';
    let box = '';
    let answers = [];
    slideList.forEach(element => {
        if (element.id === activeSlideId) {
            element.question = document.querySelector('#question').value;
            document.querySelector('.slideTitle').innerHTML = element.question;
            box = document.querySelector('#chart');
            while (box.firstChild) {
                box.removeChild(box.firstChild)
            }
            options = {
                chart: {
                    type: 'bar'
                },
                series: [{
                    name: 'sales',
                    data: []
                }],
                xaxis: {
                    categories: []
                }
            }
            pieOptions = {
                chart: {
                    type: 'donut'
                },
                series: [],
                labels: []
            }
            areaOptions = {
                chart: {
                    type: "area"
                },
                dataLabels: {
                    enabled: false
                },
                series: [
                    {
                        name: "Series 1",
                        data: []
                    }
                ],
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 90, 100]
                    }
                },
                xaxis: {
                    categories: []
                }
            }
            radarOptions = {
                series: [{
                    name: 'Series 1',
                    data: [],
                }],
                chart: {
                    height: 350,
                    type: 'radar',
                },
                xaxis: {
                    categories: []
                }
            }
            polarOptions = {
                series: [],
                labels: [],
                chart: {
                    type: 'polarArea',
                },
                stroke: {
                    colors: ['#fff']
                },
                fill: {
                    opacity: 0.8
                }
            }
            optionsData = document.querySelectorAll('.optionItem');
            answers = [];
            for (let i = 0; i < optionsData.length; i++) {
                answers[i] = new NewAnswer();
                answers[i].id = i;
                answers[i].text = optionsData[i].querySelector('input').value;
            }
            if (document.querySelector('#bar').checked) {
                for (let i = 0; i < optionsData.length; i++) {
                    options.xaxis.categories.push(answers[i].text);
                    options.series[0].data.push(1 + i);
                }
                chosenOptions = options;
                chartType = 'bar';
            }
            if (document.querySelector('#pie').checked) {
                for (let i = 0; i < optionsData.length; i++) {
                    pieOptions.labels.push(answers[i].text);
                    pieOptions.series.push(1 + i);
                }
                chosenOptions = pieOptions;
                chartType = 'pie';
            }
            if (document.querySelector('#area').checked) {
                for (let i = 0; i < optionsData.length; i++) {
                    areaOptions.xaxis.categories.push(answers[i].text);
                    areaOptions.series[0].data.push(1 + i);
                }
                chosenOptions = areaOptions;
                chartType = 'area';
            }
            if (document.querySelector('#radar').checked) {
                for (let i = 0; i < optionsData.length; i++) {
                    radarOptions.xaxis.categories.push(answers[i].text);
                    radarOptions.series[0].data.push(1 + i);
                }
                chosenOptions = radarOptions;
                chartType = 'radar';
            }
            if (document.querySelector('#polar').checked) {
                for (let i = 0; i < optionsData.length; i++) {
                    polarOptions.labels.push(answers[i].text);
                    polarOptions.series.push(1 + i);
                }
                chosenOptions = polarOptions;
                chartType = 'polar';
            }
            chart = new ApexCharts(document.querySelector('#chart'), chosenOptions);
            chart.render();
            element.chartsID = chartType;
            element.answers = answers;
        }
    });
    options = '';
    pieOptions = '';
    areaOptions = '';
    radarOptions = '';
    polarOptions = '';
    optionsData = '';
    chartType = '';
    box = '';
    answers = [];
    SavePresentation(presentationId, activeSlideId, 'Презентация', slideList).then(r => {
        console.log(r);
    })
})


function rewriteContent(id) {
    if (chart) {
        chart.destroy();
    }
    let answerInputs = document.querySelector('.optionItems');
    while (answerInputs.firstChild) {
        answerInputs.removeChild(answerInputs.firstChild);
    }
    let box = document.querySelector('#chart');
    while (box.firstChild) {
        box.removeChild(box.firstChild);
    }
    if (slideList[activeSlideId-1].chartsID === 'image'){
        document.querySelector('.slideTitle').innerHTML = slideList[activeSlideId-1].question;
        let slidePic = document.createElement('div');
        slidePic.className = 'slidePic';
        slidePic.innerHTML = '<img src="" id="output" alt="picture">'
        document.querySelector('#chart').appendChild(slidePic)
        let image = document.querySelector('#output');
        image.src = slideList[activeSlideId-1].answers[0].text;
    } else {
        slideList.forEach(item => {
            if (item.question) {
                if (item.id === id) {
                    document.querySelector('.slideTitle').innerHTML = item.question;
                    let box = document.querySelector('#chart');
                    while (box.firstChild) {
                        box.removeChild(box.firstChild)
                    }

                    for (let i = 0; i < item.answers.length; i++) {
                        addOption();
                    }
                    let chosenOptions = '';
                    let options = {
                        chart: {
                            type: 'bar'
                        },
                        series: [{
                            name: 'sales',
                            data: []
                        }],
                        xaxis: {
                            categories: []
                        }
                    }
                    let pieOptions = {
                        chart: {
                            type: 'donut'
                        },
                        series: [],
                        labels: []
                    }
                    let areaOptions = {
                        chart: {
                            type: "area"
                        },
                        dataLabels: {
                            enabled: false
                        },
                        series: [
                            {
                                name: "Series 1",
                                data: []
                            }
                        ],
                        fill: {
                            type: "gradient",
                            gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.7,
                                opacityTo: 0.9,
                                stops: [0, 90, 100]
                            }
                        },
                        xaxis: {
                            categories: []
                        }
                    }
                    let radarOptions = {
                        series: [{
                            name: 'Series 1',
                            data: [],
                        }],
                        chart: {
                            height: 350,
                            type: 'radar',
                        },
                        xaxis: {
                            categories: []
                        }
                    }
                    let polarOptions = {
                        series: [],
                        labels: [],
                        chart: {
                            type: 'polarArea',
                        },
                        stroke: {
                            colors: ['#fff']
                        },
                        fill: {
                            opacity: 0.8
                        }
                    }
                    if (item.chartsID === 'bar') {
                        for (let i = 0; i < item.answers.length; i++) {
                            options.xaxis.categories.push(item.answers[i].text);
                            options.series[0].data.push(1 + i);
                        }
                        chosenOptions = options;
                    }
                    if (item.chartsID === 'pie') {
                        for (let i = 0; i < item.answers.length; i++) {
                            pieOptions.labels.push(item.answers[i].text);
                            pieOptions.series.push(1 + i);
                        }
                        chosenOptions = pieOptions;
                    }
                    if (item.chartsID === 'area') {
                        for (let i = 0; i < item.answers.length; i++) {
                            areaOptions.xaxis.categories.push(item.answers[i].text);
                            areaOptions.series[0].data.push(1 + i);
                        }
                        chosenOptions = areaOptions;
                    }
                    if (item.chartsID === 'radar') {
                        for (let i = 0; i < item.answers.length; i++) {
                            radarOptions.xaxis.categories.push(item.answers[i].text);
                            radarOptions.series[0].data.push(1 + i);
                        }
                        chosenOptions = radarOptions;
                    }
                    if (item.chartsID === 'polar') {
                        for (let i = 0; i < item.answers.length; i++) {
                            polarOptions.labels.push(item.answers[i].text);
                            polarOptions.series.push(1 + i);
                        }
                        chosenOptions = polarOptions;
                    }
                    chart = new ApexCharts(document.querySelector('#chart'), chosenOptions);
                    chart.render();
                }
            } else {
                if (item.id === id) {
                    document.querySelector('.slideTitle').innerHTML = "Вопрос"
                    let box = document.querySelector('#chart');
                    while (box.firstChild) {
                        box.removeChild(box.firstChild)
                    }
                }
            }
        })
    }

    clearFields();
}

function renewSlides() {
    existingSlides = document.querySelectorAll('.slideMini');
    $(existingSlides).on("click", function () {
        let activeID = $(this).find('.number').data('id');
        activeSlideId = activeID;
        rewriteContent(activeID);
    })
}

let checkActive = () => {
    existingSlides = document.querySelectorAll('.slideMini');
    existingSlides.forEach(element => {
        let thisID = $(element).find('.number').data('id');
        if (thisID === activeSlideId) {
            $(existingSlides).removeClass('activeMini');
            $(element).addClass('activeMini');
        }
    })
}

let checkInterval = setInterval(() => checkActive(), 100);

renewSlides();

function clearFields() {
    document.querySelectorAll('input').forEach(element => {
        element.value = '';
    })
}

// document.querySelectorAll('.remove').forEach( element => {
//     $(element).on('click', function (){
//         slideList.splice(activeSlideId-1, 1);
//         existingSlides = document.querySelectorAll('.slideMini');
//         document.querySelector('.slideList').removeChild(existingSlides[activeSlideId-1]);
//         activeSlideId = 1;
//     })
// })
