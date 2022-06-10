window.Backend = "http://localhost:8085"

// Добавить опцию
document.querySelector('.addOption').onclick = () => {
    let option = document.createElement('div');
    option.className = 'optionItem';
    option.innerHTML = '<input type="text" placeholder="Вариант">'
    document.querySelector('.optionItems').appendChild(option);
}

// Получение презентации по id
async function GetPresentation(presentationID){
    return new Promise(async (resolve, reject) => {
        await axios.get(window.Backend + '/api/presentation/' + presentationID)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

// Сохранение презентации
async function SavePresentation(presentationID = null, activeSlide = null, presentationName = "", slides = []){
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
async function GetChartsResult(id_slide, id_presentation){
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

function NewAnswer(id, text){
    this.id = id;
    this.text = text;
}

let id = 1;
let slideList = [];
let index = 0;
let activeSlideId;



function addSlide() {
    let newGraph = new NewSLide(id);
    activeSlideId = id;
    let miniSlide = document.createElement('div');
    miniSlide.className = 'slideMini';
    miniSlide.innerHTML = '<p class="number" data-id="' + id + '">' + id + '</p> <div class="pic"></div>'
    document.querySelector('.slideList').appendChild(miniSlide);
    slideList[index] = newGraph;
    index++;
    id++;
    return newGraph;
}

addSlide();
let existingSlides = document.querySelectorAll('.slideMini');

document.querySelector('.addSlide').onclick = () => {
    addSlide();
    renewSlides();
    rewriteContent(activeSlideId);
    clearFields();
}
 const presentationId = null;

document.querySelector('.createGraph').onclick = () => {
    slideList.forEach(element => {
        if (element.id === activeSlideId) {
            element.question = document.querySelector('#question').value;
            document.querySelector('.slideTitle').innerHTML = element.question;

            let box = document.querySelector('#chart');
            while(box.firstChild){
                box.removeChild(box.firstChild)
            }
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
            let optionsData = document.querySelectorAll('.optionItem');
            let chart;
            let chartType;
            let answers = [];
            for (let i = 0; i < optionsData.length; i++){
                answers[i] = new NewAnswer();
                answers[i].id = i;
                answers[i].text = optionsData[i].querySelector('input').value;
            }
            if (document.querySelector('#bar').checked){
                for (let i = 0; i < optionsData.length; i++){
                    options.xaxis.categories.push(answers[i].text);
                    options.series[0].data.push(1+i);
                }
                chart = new ApexCharts(document.querySelector("#chart"), options);
                chartType = 'bar';
            }
            if (document.querySelector('#pie').checked){
                for (let i = 0; i < optionsData.length; i++){
                    pieOptions.labels.push(answers[i].text);
                    pieOptions.series.push(50);
                }
                chart = new ApexCharts(document.querySelector("#chart"), pieOptions);
                chartType = 'pie';
            }
            chart.render();
            element.chartsID = chartType;
            element.answers = answers;
        }
    });
    SavePresentation(presentationId, activeSlideId, 'Презентация', slideList).then(r => {
        console.log(r);
    })
}

function rewriteContent(id) {
    slideList.forEach(item => {
        if (item.question) {
            if (item.id === id) {
                document.querySelector('.slideTitle').innerHTML = item.question;
                let box = document.querySelector('#chart');
                while(box.firstChild){
                    box.removeChild(box.firstChild)
                }
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
                let chart;
                if (item.chartsID === 'bar'){
                    for (let i = 0; i < item.answers.length; i++){
                        options.xaxis.categories.push(item.answers[i].text);
                        options.series[0].data.push(1+i);
                    }
                    chart = new ApexCharts(document.querySelector("#chart"), options);
                }
                if (item.chartsID === 'pie'){
                    for (let i = 0; i < item.answers.length; i++){
                        pieOptions.labels.push(item.answers[i].text);
                        pieOptions.series.push(50);
                    }
                    chart = new ApexCharts(document.querySelector("#chart"), pieOptions);
                }
                chart.render();
            }
        } else {
            if (item.id === id) {
                document.querySelector('.slideTitle').innerHTML = "Вопрос"
                let box = document.querySelector('#chart');
                while(box.firstChild){
                    box.removeChild(box.firstChild)
                }
            }
        }
    })
    clearFields();
}

function renewSlides() {
    existingSlides = document.querySelectorAll('.slideMini');
    $(existingSlides).on("click", function () {
        let activeID = $(this).find('.number').data('id');
        activeSlideId = activeID;
        rewriteContent(activeID);
        $(existingSlides).removeClass('activeMini');
        $(this).addClass('activeMini');
    })
}


renewSlides();

function clearFields(){
    document.querySelectorAll('input').forEach( element => {
        element.value = '';
    })
}