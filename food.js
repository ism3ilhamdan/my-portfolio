document.addEventListener("DOMContentLoaded", () => {
    const addFoodForm = document.getElementById("addFoodForm");
    const foodTableBody = document.getElementById("foodTableBody");

    let foodData = JSON.parse(localStorage.getItem("foodDistribution")) || [];

    const renderTable = () => {
        foodTableBody.innerHTML = "";
        foodData.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.area}</td>
                <td>${item.mealName}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.potsCount}</td>
                <td>
                    <span class="badge ${item.status === 'تم التسليم' ? 'bg-success' : 'bg-warning'}">${item.status}</span>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm btn-edit" data-index="${index}">تعديل</button>
                    <button class="btn btn-danger btn-sm btn-delete" data-index="${index}">حذف</button>
                    <button class="btn btn-info btn-sm btn-status" data-index="${index}">
                        ${item.status === 'تم التسليم' ? 'لم يتم التسليم' : 'تم التسليم'}
                    </button>
                </td>
            `;
            foodTableBody.appendChild(row);
        });
        localStorage.setItem("foodDistribution", JSON.stringify(foodData));
    };

    addFoodForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newRecord = {
            area: document.getElementById("foodArea").value,
            mealName: document.getElementById("mealName").value,
            date: document.getElementById("distributionDate").value,
            time: document.getElementById("distributionTime").value,
            potsCount: document.getElementById("potsCount").value,
            status: "لم يتم التسليم"
        };
        foodData.push(newRecord);
        renderTable();
        addFoodForm.reset();
    });

    foodTableBody.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("btn-delete")) {
            if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
                foodData.splice(index, 1);
                renderTable();
            }
        } else if (e.target.classList.contains("btn-edit")) {
            const itemToEdit = foodData[index];
            document.getElementById("foodArea").value = itemToEdit.area;
            document.getElementById("mealName").value = itemToEdit.mealName;
            document.getElementById("distributionDate").value = itemToEdit.date;
            document.getElementById("distributionTime").value = itemToEdit.time;
            document.getElementById("potsCount").value = itemToEdit.potsCount;

            const submitBtn = document.querySelector("#addFoodForm button[type='submit']");
            submitBtn.textContent = "تعديل السجل";
            
            const newSubmitHandler = (editEvent) => {
                editEvent.preventDefault();
                foodData[index].area = document.getElementById("foodArea").value;
                foodData[index].mealName = document.getElementById("mealName").value;
                foodData[index].date = document.getElementById("distributionDate").value;
                foodData[index].time = document.getElementById("distributionTime").value;
                foodData[index].potsCount = document.getElementById("potsCount").value;

                renderTable();
                addFoodForm.reset();
                submitBtn.textContent = "إضافة توزيع وجبة";
                submitBtn.removeEventListener("click", newSubmitHandler);
                addFoodForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    // Re-add the original submit logic
                });
            };
            submitBtn.addEventListener("click", newSubmitHandler, { once: true });
        } else if (e.target.classList.contains("btn-status")) {
            foodData[index].status = foodData[index].status === 'تم التسليم' ? 'لم يتم التسليم' : 'تم التسليم';
            renderTable();
        }
    });

    renderTable();
});