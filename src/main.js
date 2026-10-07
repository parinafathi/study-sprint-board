import './style.css';

const STORAGE_KEY = 'study-sprint-board-tasks'


let tasks = [
  { id: 1, title: 'تمرین کار با DOM در JS', subject: 'جاوااسکریپت', priority: 'high', status: 'todo' },
  { id: 2, title: 'خواندن لغات درس ۳ کتاب ۵۰۴', subject: 'زبان انگلیسی', priority: 'medium', status: 'todo' },
  { id: 3, title: 'حل مسائل مشتق و حد', subject: 'ریاضی', priority: 'high', status: 'inprogress' },
  { id: 4, title: 'یادگیری کانسپت Array Methods', subject: 'جاوااسکریپت', priority: 'medium', status: 'inprogress' },
  { id: 5, title: 'مرور مدل‌های جنگو (Django)', subject: 'پایتون', priority: 'low', status: 'done' },
  { id: 6, title: 'نصب و کانفیگ Vite و Tailwind', subject: 'فرانت‌اند', priority: 'low', status: 'done' }
];


const todoList = document.getElementById('todo-list');
const inprogressList = document.getElementById('inprogress-list');
const doneList = document.getElementById('done-list');


const addTaskForm= document.getElementById('add-task-form');
const taskTitleInput = document.getElementById('task-title');
const  taskSubjectInput =document.getElementById('task-subject');
const taskPrioritySelect = document.getElementById('task-priority');
const formError = document.getElementById('form-error')


const searchInput = document.getElementById('search-input');
const priorityFilter = document.getElementById('priority-filter');


const totalTasksCount = document.getElementById('total-tasks-count');
const progressPercent = document.getElementById('progress-percent');

function saveTasks(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

}

function loadTasks(){
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData){
    try{

   
    tasks =JSON.parse(savedData);

     }catch(error){
      console.error('خطا در خواندن اطلاعات از localStorage:', error);

     }
  }
  
}




function updateStats() {
  const total = tasks.length;
  const doneCount = tasks.filter(task => task.status === 'done').length;

  const percentage = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  if (totalTasksCount) totalTasksCount.textContent = total;
  if (progressPercent) progressPercent.textContent = `${percentage}%`;
}




function renderBoard() {

  todoList.innerHTML = '';
  inprogressList.innerHTML = '';
  doneList.innerHTML = '';


  const searchQuery = searchInput.value.trim().toLowerCase();
  const selectedPriority = priorityFilter.value;


  const filteredTasks = tasks.filter(task =>{
    const machesSearch = task.title.toLowerCase().includes(searchQuery)||
    task.subject.toLowerCase().includes(searchQuery);

    const machesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    return machesSearch && machesPriority;
  });



  filteredTasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3';

  
    const priorityColors = {
      high: 'bg-rose-100 text-rose-700 border-rose-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-slate-100 text-slate-600 border-slate-200'
    };

    const priorityLabels = { high: 'بالا 🔥', medium: 'متوسط ⚡', low: 'پایین 🌱' };

  
    let moveButtonsHtml = '';

    if (task.status === 'todo') {
      moveButtonsHtml = `
        <button onclick="moveTask(${task.id}, 'inprogress')" class="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded-lg transition-colors cursor-pointer">
          شروع 👈
        </button>
      `;
    } else if (task.status === 'inprogress') {
      moveButtonsHtml = `
        <button onclick="moveTask(${task.id}, 'todo')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg transition-colors cursor-pointer">
          👉 بازگشت
        </button>
        <button onclick="moveTask(${task.id}, 'done')" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg transition-colors cursor-pointer">
          تکمیل ✅
        </button>
      `;
    } else if (task.status === 'done') {
      moveButtonsHtml = `
        <button onclick="moveTask(${task.id}, 'inprogress')" class="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded-lg transition-colors cursor-pointer">
          👉 ادامه کار
        </button>
      `;
    }


    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-xs px-2.5 py-1 rounded-md font-medium border ${priorityColors[task.priority]}">
          ${priorityLabels[task.priority]}
        </span>
        <span class="text-xs text-slate-400 font-medium">${task.subject}</span>
      </div>
      <h3 class="font-semibold text-slate-800 text-sm mt-1">${task.title}</h3>
      <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
        <div class="flex gap-1">
          ${moveButtonsHtml}
        </div>
        <button onclick="deleteTask(${task.id})" class="text-xs text-rose-500 hover:text-rose-700 p-1 rounded-lg transition-colors cursor-pointer" title="حذف کار">
          🗑️
        </button>
      </div>
   
      `;


    if (task.status === 'todo') todoList.appendChild(card);
    else if (task.status === 'inprogress') inprogressList.appendChild(card);
    else if (task.status === 'done') doneList.appendChild(card);
  });

updateStats();
}











addTaskForm.addEventListener('submit', (e) => {

  e.preventDefault();


  const title = taskTitleInput.value.trim();
  const subject = taskSubjectInput.value.trim();
  const priority = taskPrioritySelect.value;


  if (!title || !subject) {
    formError.textContent = '❌ لطفاً هم عنوان و هم موضوع کار را وارد کنید!';
    formError.classList.remove('hidden');
    return;
  }

  formError.classList.add('hidden');


  const newTask = {
    id: Date.now(),
    title: title,
    subject: subject,
    priority: priority,
    status: 'todo' 
  };


  tasks.unshift(newTask);

  saveTasks();
  renderBoard();
  taskTitleInput.value = '';
  taskSubjectInput.value = '';
  taskPrioritySelect.value = 'medium';


updateStats();
});



window.moveTask = function(id, newStatus) {

  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus; 
    saveTasks();
    renderBoard(); 
  }
};


window.deleteTask = function(id) {
  if (confirm('آیا از حذف این کار مطمئن هستید؟')) {

    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderBoard(); 
  }
};




searchInput.addEventListener('input', () => {
  renderBoard();
});


priorityFilter.addEventListener('change', () => {
  renderBoard();
});




loadTasks(); 
renderBoard();