import { Toast } from "bootstrap";

export class ToastService {
    private toast: Toast;
    private className = 'toast fade hide '
    showToast(message: string, classNames: string = 'bg-success text-white') {
        const toastEl = document.getElementById("app-toast");
        if (!this.toast) {
            this.toast = new Toast(toastEl);
        }
        toastEl.className = this.className + classNames;
        document.getElementById("app-toast-body").innerText = message;
        this.toast.show();
    }
}