

//adding another option
document.querySelector('.addOption').onclick = () => {
    let option = document.createElement('div');
    option.className='optionItem';
    option.innerHTML = '<input type="text" placeholder="Вариант">'
    document.querySelector('.optionItems').appendChild(option);
}


function NewSLide(id, title, options){
    this.id = id;
    this.title = title;
    this.options = options;
}

let id = 1;
let slideList = [];
let index = 0;
let activeSlideId;

function addSlide(){
    let newGraph = new NewSLide(id);
    activeSlideId = id;
    let miniSlide = document.createElement('div');
    miniSlide.className = 'slideMini';
    miniSlide.innerHTML = '<p class="number" data-id="'+id+'">'+id+'</p> <div class="pic"></div>'
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
    clearInputs();
}

document.querySelector('.createGraph').onclick = () => {
    slideList.forEach( element => {
        if (element.id === activeSlideId){
            element.title = document.querySelector('#question').value;
            document.querySelector('.slideTitle').innerHTML = element.title;
            let options = document.querySelectorAll('.optionItem');
            let box = document.querySelector('.slideGraph')
            while(box.firstChild){
                box.removeChild(box.firstChild);
            }
            for (let i = 0; i<options.length; i++){
                let name = element.options = options[i].querySelector('input').value;
                if (name){
                    let column = document.createElement('div');
                    column.className = 'graphColumn';
                    column.innerHTML = "<div class=\"value\">0%</div> <div class=\"title\">"+name+"</div>";
                    document.querySelector(".slideGraph").appendChild(column);
                }
            }
        }
    })
}
function rewriteContent(id){
    slideList.forEach(item => {
        if (item.title){
            if (item.id === id){
                document.querySelector('.slideTitle').innerHTML = item.title;
                let options = document.querySelectorAll('.optionItem');
                let box = document.querySelector('.slideGraph')
                while(box.firstChild){
                    box.removeChild(box.firstChild);
                }
                for (let i = 0; i<options.length; i++){
                    let name = item.options;
                    if (name){
                        let column = document.createElement('div');
                        column.className = 'graphColumn';
                        column.innerHTML = "<div class=\"value\">0%</div> <div class=\"title\">"+name+"</div>";
                        document.querySelector(".slideGraph").appendChild(column);
                    }
                }
            }
        } else {
            if (item.id === id){
                document.querySelector('.slideTitle').innerHTML = "Вопрос"
                let options = document.querySelectorAll('.optionItem');
                let box = document.querySelector('.slideGraph')
                while(box.firstChild){
                    box.removeChild(box.firstChild);
                }
                for (let i = 0; i<options.length; i++){
                    let column = document.createElement('div');
                    column.className = 'graphColumn';
                    column.innerHTML = "<div class=\"value\">0%</div> <div class=\"title\">Имя</div>";
                    document.querySelector(".slideGraph").appendChild(column);
                }
            }
        }
    })
    console.log(id);
}

function renewSlides(){
    existingSlides = document.querySelectorAll('.slideMini');

    $(existingSlides).on("click", function (){
        let activeID = $(this).find('.number').data('id');
        activeSlideId = activeID;
        rewriteContent(activeID);
        clearInputs();
    })
}


renewSlides();

function clearInputs(){
    document.querySelectorAll('input').forEach( element => {
        element.value = "";
    })
}