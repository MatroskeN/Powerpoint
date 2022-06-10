window.Backend = "http://localhost:8085"

//adding another option
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

async function SavePresentation(presentationID = null, activeSlide = null, presentationName = ""){
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
                    chartsId: 4,
                    answers: [
                        {
                            id: 1,
                            text: "Ты пидрs?"
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


GetPresentation(1).then((res) => {
    console.log(res)
})


function NewSLide(id, title, chart) {
    this.id = id;
    this.title = title;
    this.chart = chart;
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

document.querySelector('.createGraph').onclick = () => {
    slideList.forEach(element => {
        if (element.id === activeSlideId) {
            element.title = document.querySelector('#question').value;
            document.querySelector('.slideTitle').innerHTML = element.title;
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
            let box = document.querySelector('#chart');
            while(box.firstChild){
                box.removeChild(box.firstChild)
            }
            let optionsData = document.querySelectorAll('.optionItem');
            let chart;
            if (document.querySelector('#bar').checked){
                for (let i = 0; i < optionsData.length; i++){
                    options.xaxis.categories.push(optionsData[i].querySelector('input').value);
                    options.series[0].data.push(1+i);
                }
                chart = new ApexCharts(document.querySelector("#chart"), options);
            }
            if (document.querySelector('#pie').checked){
                for (let i = 0; i < optionsData.length; i++){
                    pieOptions.labels.push(optionsData[i].querySelector('input').value);
                    pieOptions.series.push(50);
                }
                chart = new ApexCharts(document.querySelector("#chart"), pieOptions);
            }
            element.chart = chart;
            element.chart.render();
        }
    })
}

function rewriteContent(id) {
    slideList.forEach(item => {
        if (item.title) {
            if (item.id === id) {
                document.querySelector('.slideTitle').innerHTML = item.title;
                let box = document.querySelector('#chart');
                while(box.firstChild){
                    box.removeChild(box.firstChild)
                }
                item.chart.render();
                // let box = document.querySelector('.slideGraph');
                // while (box.firstChild) {
                //     box.removeChild(box.firstChild);
                // }
                // for (let i = 0; i < item.options.length; i++) {
                //     console.log(item.options[i]);
                //     let name = item.options[i];
                //     if (name) {
                //         let column = document.createElement('div');
                //         column.className = 'graphColumn';
                //         column.innerHTML = "<div class=\"value\">0%</div> <div class=\"title\">" + name + "</div>";
                //         document.querySelector(".slideGraph").appendChild(column);
                //     }
                // }
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