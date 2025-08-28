document.addEventListener("DOMContentLoaded", () => {
    // منطق صفحة التسجيل (register.html)
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        const maritalStatus = document.getElementById("maritalStatus");
        const familyMembersField = document.getElementById("familyMembersField");

        maritalStatus.addEventListener("change", () => {
            if (maritalStatus.value === 'متزوج') {
                familyMembersField.style.display = 'block';
                familyMembersField.querySelector('input').setAttribute('required', 'required');
            } else {
                familyMembersField.style.display = 'none';
                familyMembersField.querySelector('input').removeAttribute('required');
            }
        });

        registrationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries')) || [];
            const idNumber = document.getElementById('idNumber').value;

            const idExists = beneficiaries.some(b => b.idNumber === idNumber);
            if (idExists) {
                alert('رقم الهوية هذا مسجل بالفعل. يرجى استخدام رقم آخر.');
                return;
            }

            const newBeneficiary = {
                fullName: document.getElementById('fullName').value,
                idNumber: idNumber,
                maritalStatus: maritalStatus.value,
                familyMembers: maritalStatus.value === 'متزوج' ? document.getElementById('familyMembers').value : null,
                password: document.getElementById('password').value,
                isActive: true
            };
            beneficiaries.push(newBeneficiary);
            localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
            alert('تم إنشاء الحساب بنجاح!');
            window.location.href = 'login.html';
        });
    }

    // منطق صفحة تسجيل الدخول (login.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const loginIdNumber = document.getElementById('loginIdNumber').value;
            const loginPassword = document.getElementById('loginPassword').value;

            const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries')) || [];
            const user = beneficiaries.find(b => b.idNumber === loginIdNumber && b.password === loginPassword);

            if (user) {
                if (!user.isActive) {
                    alert('حسابك غير نشط. يرجى التواصل مع المسؤول.');
                    return;
                }
                
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                
                const successToast = new bootstrap.Toast(document.getElementById('successToast'));
                document.getElementById('toastMessage').textContent = 'تم تسجيل الدخول بنجاح!';
                successToast.show();

                setTimeout(() => {
                    window.location.href = 'user-profile.html';
                }, 1000);
            } else {
                alert('رقم الهوية أو كلمة المرور غير صحيحة.');
            }
        });
    }

    // منطق صفحة إدارة المستفيدين (user-management.html)
    const beneficiaryTableBody = document.getElementById("beneficiaryTableBody");
    if (beneficiaryTableBody) {
        const renderBeneficiariesTable = () => {
            const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries')) || [];
            beneficiaryTableBody.innerHTML = '';
            beneficiaries.forEach((beneficiary, index) => {
                const row = document.createElement('tr');
                const statusBadge = beneficiary.isActive ? 
                    '<span class="badge bg-success">نشط</span>' : 
                    '<span class="badge bg-danger">غير نشط</span>';

                row.innerHTML = `
                    <td>${beneficiary.fullName}</td>
                    <td>${beneficiary.idNumber}</td>
                    <td>${beneficiary.maritalStatus}</td>
                    <td>${beneficiary.familyMembers || 'غير متاح'}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm btn-toggle-status" data-index="${index}">
                            ${beneficiary.isActive ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button class="btn btn-warning btn-sm btn-edit" data-index="${index}">تعديل</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-index="${index}">حذف</button>
                    </td>
                `;
                beneficiaryTableBody.appendChild(row);
            });
        };

        beneficiaryTableBody.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries')) || [];
            if (e.target.classList.contains('btn-delete')) {
                if (confirm('هل أنت متأكد من حذف هذا المستفيد؟')) {
                    beneficiaries.splice(index, 1);
                    localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
                    renderBeneficiariesTable();
                }
            } else if (e.target.classList.contains('btn-toggle-status')) {
                beneficiaries[index].isActive = !beneficiaries[index].isActive;
                localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
                renderBeneficiariesTable();
            }
        });

        renderBeneficiariesTable();
    }
});