/**
 * taskList: Tham chiếu đến danh sách công việc (ul#task-list).

todoForm: Tham chiếu đến form nhập công việc (form#todo-form).

todoInput: Tham chiếu đến ô nhập công việc (input#todo-input).
 */
const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

// Lấy danh sách công việc từ LocalStorage hoặc tạo mảng rỗng nếu chưa có
/**
 * Dữ liệu được lấy từ LocalStorage (localStorage.getItem("tasks")).

Nếu có dữ liệu, nó sẽ được chuyển từ JSON sang mảng (JSON.parse).

Nếu chưa có dữ liệu, gán tasks = [] (mảng rỗng).
 */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/**
 * Chuyển mảng tasks thành chuỗi JSON (JSON.stringify).

Lưu vào LocalStorage với key "tasks".
 */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * e.target: Phần tử mà người dùng đã nhấn vào (nút Edit, Mark as done, hoặc Delete).

    .closest(".task-item"): Tìm phần tử cha gần nhất có class "task-item" (chính là <li> chứa công việc).

    Kiểm tra if (!taskItem) return;:

    Nếu không tìm thấy phần tử <li class="task-item">, thoát khỏi hàm (tránh lỗi).
 */
function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    /**
     * taskItem.getAttribute("task-index")

        Lấy giá trị thuộc tính task-index của <li>.

        task-index được đặt khi tạo danh sách công việc trong renderTasks().

        +taskItem.getAttribute("task-index")

        Dấu + giúp chuyển chuỗi sang số.

        const task = tasks[taskIndex];

        Lấy đối tượng công việc tương ứng trong mảng tasks.
     */
    const taskIndex = +taskItem.getAttribute("task-index");
    const task = tasks[taskIndex];

    // Sửa công việc (edit)
    if (e.target.closest(".edit")) {
        // Hiển thị hộp thoại prompt() để nhập nội dung mới.
        const newTitle = prompt("Enter the new task title:", task.title); 
        if (newTitle) {
            task.title = newTitle; // Cập nhật tiêu đề (task.title = newTitle).
            // Thêm hiệu ứng nhấp nháy (.highlight).
            taskItem.classList.add("highlight");
            setTimeout(() => taskItem.classList.remove("highlight"), 500);
            // Lưu thay đổi (saveTasks()) và cập nhật giao diện (renderTasks()).
            saveTasks();
            renderTasks();
        }
    } 

    // Đánh dấu hoàn thành (done)
    else if (e.target.closest(".done")) {
        task.completed = !task.completed; // Đảo trạng thái completed (true/false).
        // Thêm hiệu ứng nhấp nháy (.highlight).
        taskItem.classList.add("highlight");
        setTimeout(() => taskItem.classList.remove("highlight"), 500); 
        // Lưu và cập nhật giao diện.
        saveTasks(); 
        renderTasks();
    } 

    // Xóa công việc (delete)
    else if (e.target.closest(".delete")) {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) { // Hiển thị xác nhận (confirm()).
            taskItem.classList.add("fade-out"); // Thêm hiệu ứng biến mất (fade-out).
            setTimeout(() => {
                tasks.splice(taskIndex, 1); // Xóa khỏi mảng tasks.splice(taskIndex, 1).
                // Lưu thay đổi (saveTasks()) và cập nhật giao diện (renderTasks()).
                saveTasks();
                renderTasks();
            }, 500);
        }
    }
}

function addTask(e) {
    e.preventDefault(); // Ngăn chặn form load lại trang (e.preventDefault()).
    const value = todoInput.value.trim(); // Lấy nội dung nhập vào (trim() để loại bỏ khoảng trắng thừa).
    if (!value) return alert("Please write something!"); // Nếu không có nội dung, báo lỗi (alert()).

    // Thêm công việc mới vào mảng tasks.
    tasks.push({
        title: value,
        completed: false,
    });
    saveTasks(); // Gọi saveTasks() để lưu vào LocalStorage.
    renderTasks(); // Gọi renderTasks() để cập nhật danh sách trên giao diện.
    todoInput.value = ""; // Xóa nội dung ô nhập sau khi thêm.
}

/**
 *  Tạo danh sách công việc bằng .map().

    Dùng class "completed" để thay đổi giao diện công việc hoàn thành.

    Sử dụng task-index để xác định vị trí trong mảng tasks.
 */
function renderTasks() {
    taskList.innerHTML = tasks
        .map(
            (task, index) => `
    <li class="task-item fade-in ${task.completed ? "completed" : ""}" task-index="${index}">
        <span class="task-title">${task.title}</span>
        <div class="task-action">
            <button class="task-btn edit">Edit</button>
            <button class="task-btn done">${task.completed ? "Mark as undone" : "Mark as done"}</button>
            <button class="task-btn delete">Delete</button>
        </div>
    </li>
`
        )
        .join("");
    //Hiệu ứng fade-in khi hiển thị danh sách.
    setTimeout(() => {
        document.querySelectorAll(".task-item").forEach(item => item.classList.remove("fade-in"));
    }, 500);
}

todoForm.addEventListener("submit", addTask); // Bắt sự kiện khi nhấn "Add Task" (submit trên form).
taskList.addEventListener("click", handleTaskActions); //Lắng nghe sự kiện click để xử lý sửa, hoàn thành, xóa công việc.

// Khi trang tải, hiển thị danh sách công việc từ LocalStorage.
renderTasks();
