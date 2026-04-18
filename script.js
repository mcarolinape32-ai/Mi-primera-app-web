let selectedDate = localStorage.getItem('selectedDate') || new Date().toISOString().split('T')[0];
let data = JSON.parse(localStorage.getItem('calendarTasks')) || {};

function save(){
  localStorage.setItem('calendarTasks', JSON.stringify(data));
  localStorage.setItem('selectedDate', selectedDate);
}

function getEmoji(text){
  text = text.toLowerCase();
  if(text.includes('amor') || text.includes('autoestima')) return '💖';
  if(text.includes('gym') || text.includes('ejercicio')) return '🏋️‍♀️';
  if(text.includes('música')) return '🎵';
  if(text.includes('comida') || text.includes('rico')) return '🍔';
  return '✨';
}

function changeDay(){
  selectedDate = document.getElementById('datePicker').value;
  save();
  render();
}

function addTask(){
  const input = document.getElementById('input');
  if(input.value.trim()==='') return;

  if(!data[selectedDate]) data[selectedDate] = [];

  data[selectedDate].push({text:input.value, done:false, emoji:getEmoji(input.value)});
  input.value='';
  save();
  render();
}

function toggle(i, element){
  data[selectedDate][i].done = !data[selectedDate][i].done;

  element.classList.add('pop');
  createHearts(element);

  setTimeout(()=>element.classList.remove('pop'),400);

  save();
  render();
}

function createHearts(el){
  for(let i=0;i<3;i++){
    const heart = document.createElement('div');
    heart.className='heart';
    heart.textContent='💖';

    const rect = el.getBoundingClientRect();
    heart.style.left = rect.left + Math.random()*50 + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    setTimeout(()=>heart.remove(),1000);
  }
}

function remove(i){
  data[selectedDate].splice(i,1);
  save();
  render();
}

function render(){
  document.getElementById('datePicker').value = selectedDate;

  const container = document.getElementById('dayContainer');
  container.innerHTML='';

  const block = document.createElement('div');
  block.className='day-block';

  block.innerHTML = `
    <input id="input" placeholder="Meta del día 💭">
    <button onclick="addTask()">+</button>
    <ul id="list"></ul>
  `;

  container.appendChild(block);

  const list = block.querySelector('#list');
  const tasks = data[selectedDate] || [];

  tasks.forEach((t,i)=>{
    const li = document.createElement('li');
    li.className = t.done ? 'completed':'';

    li.innerHTML = \`\${t.emoji} \${t.text} <span style="color:#ff4da6" onclick="event.stopPropagation();remove(\${i})">✖</span>\`;

    li.onclick = ()=>toggle(i, li);
    list.appendChild(li);
  });
}

render();
