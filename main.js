//create title
document.querySelector('#addQuestion').onclick = () => {
    document.querySelector('.slideTitle').innerText = document.querySelector('#question').value;
}

//adding another option
document.querySelector('.addOption').onclick = () => {
    let option = document.createElement('div');
    option.className='optionItem';
    option.innerHTML = '<input type="text" placeholder="Вариант">'
    document.querySelector('.optionItems').appendChild(option);
}

//create graph with data from inputs
document.querySelector('.createGraph').onclick = () => {
    let options = document.querySelectorAll('.optionItem');
    let box = document.querySelector('.slideGraph')
    while(box.firstChild){
        box.removeChild(box.firstChild);
    }
    for (let i = 0; i < options.length; i++){
        let name = options[i].querySelector('input').value;
        if (name){
            let column = document.createElement('div');
            column.className = 'graphColumn';
            column.innerHTML = "<div class=\"value\">0%</div> <div class=\"title\">"+name+"</div>";
            document.querySelector(".slideGraph").appendChild(column);
        }
    }
}