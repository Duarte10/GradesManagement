import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-edit-class-semester',
  templateUrl: './edit-class-semester.component.html',
  styleUrls: ['./edit-class-semester.component.scss']
})
export class EditClassSemesterComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private toast: ToastService) { }

  class: any;
  semester: any;
  currentTab = 'evaluation';
  newEvaluationComponentName = '';
  newEvaluationComponentPercentage: Number;
  componentEvaluationSum: Number;
  private routeSub: Subscription;
  private semesterId: string;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] && params['semesterId']) {
        this.loadClass(params['id']);
        this.semesterId = params['semesterId'];
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  selectTab(tab: string) {
    this.currentTab = tab;
  }

  onNewEvaluationComponentNameChange(event: any) {
    this.newEvaluationComponentName = event.target.value;
  }

  onNewEvaluationComponentPercentegaeChange(event: any) {
    this.newEvaluationComponentPercentage = parseInt(event.target.value);
  }

  addEvaluationComponent() {
    if (!this.newEvaluationComponentName || !this.newEvaluationComponentPercentage || this.newEvaluationComponentPercentage < 0) {
      this.toast.showToast("Enter a valid name or percentage", "bg-danger text-white");
      return;
    }

    if (this.semester.evaluationComponents.find(s => s.name === this.newEvaluationComponentName && s.percentage === this.newEvaluationComponentPercentage)) {
      // Do nothing
      console.log('Evaluation component already exists');
      return;
    }

    // Add the component
    this.semester.evaluationComponents.push({ name: this.newEvaluationComponentName, percentage: this.newEvaluationComponentPercentage });

    // Clear the form
    this.newEvaluationComponentName = '';
    this.newEvaluationComponentPercentage = undefined;

    // Update evaluation components sum
    this.updateEvaluationComponentsSum();
  }

  private loadClass(id: string) {
    this.http.get('class/' + id).subscribe(
      (data: any) => {
        console.log(data);
        this.class = data;
        if (data.semesters) {
          this.semester = data.semesters.find(s => s.id === this.semesterId);
          if (this.semester.evaluationComponents && this.semester.evaluationComponents.length) {
            this.updateEvaluationComponentsSum();
          }
        }

      },
      error => console.error(error)
    )
  }

  private updateEvaluationComponentsSum() {
    this.componentEvaluationSum = parseInt(this.semester.evaluationComponents.map(e => e.percentage).reduce((a, b) => a + b, 0));
  }
}

