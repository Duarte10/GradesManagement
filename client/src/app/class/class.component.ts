import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modal } from "bootstrap";
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  classes = [];
  deleteClassConfirmationModal: Modal;
  selectedClassId: string;

  constructor(private http: HttpClient, private toast: ToastService) { }

  ngOnInit() {
    // load classes
    this.http.get('class').subscribe(
      (data: any) => {
        this.classes = data;
      },
      error => console.error(error)
    );

    this.deleteClassConfirmationModal = new Modal(document.getElementById('deleteClassConfirmModal'));
  }

  promptDelete(id) {
    this.selectedClassId = id;
    if (this.deleteClassConfirmationModal) {
      this.deleteClassConfirmationModal.show();
    } else {
      console.error("Unexpected: deleteClassConfirmationModal doesn't exist");
    }
  }

  confirmDelete() {
    this.http.delete('class/' + this.selectedClassId)
      .subscribe(
        () => {
          this.toast.showToast("The class was deleted successfully");
          this.classes = this.classes.filter(c => c.id !== this.selectedClassId);
          this.selectedClassId = undefined;
          this.deleteClassConfirmationModal.hide();
        },
        error => {
          this.toast.showToast("There was a problem deleting the class, please try again later.", "bg-danger text-white");
          console.error(error);
        }
      )
  }
}
