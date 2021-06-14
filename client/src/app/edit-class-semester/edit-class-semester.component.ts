import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/toast.service';
import { Modal } from "bootstrap";

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

  // Evaluation tab variables
  editingEvaluationComponent: { name: string, percentage: Number } = {
    name: '',
    percentage: undefined
  }
  editingExistingEvaluationComponentIndex: number;
  editingExistingEvaluationComponent = false;

  componentEvaluationSum: Number;
  deleteEvaluationComponentConfirmationModal: Modal;
  evaluationComponentsDirty = false;
  private selectedEvaluationComponentId: string;
  private deletedEvaluationComponents = [];

  // Grades tab variables
  students = [];
  studentsAutocomplete = [];
  selectedStudent: any;
  studentsGradesDirty = false;
  @ViewChild('studentAutoComplete', { static: false }) studentAutocomplete;


  private routeSub: Subscription;
  private semesterId: string;
  private classId: string;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] && params['semesterId']) {
        this.loadClass(params['id']);
        this.classId = params['id'];
        this.semesterId = params['semesterId'];
      }
    });

    this.deleteEvaluationComponentConfirmationModal = new Modal(document.getElementById('deleteEvaluationComponentConfirmModal'));
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  selectTab(tab: string) {
    this.currentTab = tab;
  }

  onNewEvaluationComponentNameChange(event: any) {
    this.editingEvaluationComponent.name = event.target.value;
  }

  onNewEvaluationComponentPercentegaeChange(event: any) {
    this.editingEvaluationComponent.percentage = parseInt(event.target.value);
  }

  addEvaluationComponent() {
    if (!this.editingEvaluationComponent.name || !this.editingEvaluationComponent.percentage || this.editingEvaluationComponent.percentage < 0) {
      this.toast.showToast("Enter a valid name or percentage", "bg-danger text-white");
      return;
    }

    if (this.semester.evaluationComponents.find(s => s.name === this.editingEvaluationComponent.name && s.percentage === this.editingEvaluationComponent.percentage)) {
      // Do nothing
      console.log('Evaluation component already exists');
      return;
    }

    // Add the component
    const newEvaluationComponent = { name: this.editingEvaluationComponent.name, percentage: this.editingEvaluationComponent.percentage, values: [] };
    this.semester.evaluationComponents.push(newEvaluationComponent);

    // Clear the form
    this.editingEvaluationComponent = {
      name: '',
      percentage: undefined
    };

    // Set the data/form as dirty
    this.evaluationComponentsDirty = true;
    this.studentsGradesDirty = true;

    // Update evaluation components sum
    this.updateEvaluationComponentsSum();

    // Add new component to student grades
    this.onEvaluationComponentAdded(newEvaluationComponent);
  }

  editEvaluationComponent(evaluationComponent: any) {
    this.editingEvaluationComponent = {
      name: evaluationComponent.name,
      percentage: evaluationComponent.percentage
    };
    this.editingExistingEvaluationComponent = true;
    this.editingExistingEvaluationComponentIndex = this.semester.evaluationComponents.indexOf(evaluationComponent);
  }

  saveEvaluationComponent() {
    // find the evaluation component in the array
    let evaluationComponent = this.semester.evaluationComponents[this.editingExistingEvaluationComponentIndex];
    const evaluationComponentOldName = evaluationComponent.name;
    evaluationComponent.name = this.editingEvaluationComponent.name;
    evaluationComponent.percentage = this.editingEvaluationComponent.percentage;

    // Clear the form
    this.editingEvaluationComponent = {
      name: '',
      percentage: undefined
    };

    this.editingExistingEvaluationComponent = false;
    this.editingExistingEvaluationComponentIndex = undefined;

    // Set IsDirty flag
    this.evaluationComponentsDirty = true;
    this.studentsGradesDirty = true;

    // Update sum
    this.updateEvaluationComponentsSum();

    // Recalculate grades
    this.recalculateGrades(evaluationComponent, evaluationComponentOldName);
  }

  promptEvaluationComponentDelete(component: any) {
    if (!component._id) {
      // if the id is undefined it means it is a semester that was created now
      // for the semesters created now, don't prompt to confirm the change as it's not going to affect existing data

      this.semester.evaluationComponents.splice(this.semester.evaluationComponents.indexOf(component), 1);
      this.selectedEvaluationComponentId = undefined;
      this.updateEvaluationComponentsSum();
      this.onEvaluationComponentRemoved(component);
      return;
    }
    this.selectedEvaluationComponentId = component._id;
    if (this.deleteEvaluationComponentConfirmationModal) {
      this.deleteEvaluationComponentConfirmationModal.show();
    } else {
      console.error("Unexpected: deleteEvaluationComponentConfirmationModal doesn't exist");
    }
  }

  confirmEvaluationComponentDelete() {
    this.deletedEvaluationComponents.push(this.selectedEvaluationComponentId);
    const evaluationComponent = this.semester.evaluationComponents.find(ec => ec._id === this.selectedEvaluationComponentId);
    this.semester.evaluationComponents = this.semester.evaluationComponents.filter(c => c._id !== this.selectedEvaluationComponentId)
    this.selectedEvaluationComponentId = undefined;
    this.evaluationComponentsDirty = true;
    this.studentsGradesDirty = true;
    this.updateEvaluationComponentsSum();
    this.onEvaluationComponentRemoved(evaluationComponent)
    this.deleteEvaluationComponentConfirmationModal.hide();
  }

  save() {
    // build evaluation component values
    for (let i = 0; i < this.semester.evaluationComponents.length; i++) {
      const evaluationComponent = this.semester.evaluationComponents[i];
      evaluationComponent.values = [];
      for (let j = 0; j < this.semester.students.length; j++) {
        const student = this.semester.students[j];
        const grade = student.grades.find(g => g.name === evaluationComponent.name);
        evaluationComponent.values.push({
          student: student.id,
          value: grade.grade
        });
      }
    }

    // map semester students
    this.semester.students = this.semester.students.map(s => s.id);
    this.http.put('class-semester/' + this.semesterId, {
      ...this.semester
    }).subscribe(
      () => {
        this.toast.showToast("The semester was successfully updated");
        this.router.navigate(["class", this.classId]);
      },
      error => {
        if (error.error.message) {
          this.toast.showToast(error.error.message, "bg-danger text-white");
        } else {
          this.toast.showToast("There was an error updating the semester, please try again later", "bg-danger text-white");
        }
      }
    )
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
  }

  // Grades/Students methods
  addStudent() {
    if (!this.selectedStudent) return;
    // create shallow copy to avoid references between objects
    let student = { ...this.students.find(s => s.id === this.selectedStudent.id) };

    student.grades = [];

    // remove student from the dropdown to prevent it from being added twice
    this.studentsAutocomplete = this.studentsAutocomplete.filter(s => s.id !== this.selectedStudent.id);

    // Set default student grades
    for (let i = 0; i < this.semester.evaluationComponents.length; i++) {
      const evaluationComponent = this.semester.evaluationComponents[i];
      student.grades.push({
        name: evaluationComponent.name,
        percentage: evaluationComponent.percentage,
        grade: 0
      })
    }

    this.calculateStudentFinalGrade(student);
    this.semester.students.push(student);
    this.studentsGradesDirty = true;
    // set student grades
    this.selectedStudent = undefined;
    this.studentAutocomplete.clear();
    this.studentAutocomplete.close();
  }

  removeStudent(student) {
    // add the student to the students array so that it can be re-added to the grades table
    this.studentsAutocomplete.push({
      name: student.name + ' - ' + student.number,
      id: student.id
    });

    this.semester.students.splice(this.semester.students.indexOf(student), 1);
    this.studentsGradesDirty = true;
  }

  updatedStudentComponentGrade(student: any, grade: any, event: any) {
    // if value is invalid, reset
    if (event.target.value < 0 || event.target.value > 20) {
      // do nothing
      event.target.value = 0;
      return;
    }
    grade.grade = event.target.value;
    this.calculateStudentFinalGrade(student);
    this.studentsGradesDirty = true;
  }

  private onEvaluationComponentAdded(evaluationComponent: any) {
    for (let i = 0; i < this.semester.students.length; i++) {
      this.semester.students[i].grades.push({
        name: evaluationComponent.name,
        percentage: evaluationComponent.percentage,
        grade: 0,
        result: 0
      })
    }
  }

  private onEvaluationComponentRemoved(evaluationComponent: any) {
    for (let i = 0; i < this.semester.students.length; i++) {
      this.semester.students[i].grades = this.semester.students[i].grades.filter(g => g.name !== evaluationComponent.name);
    }
  }

  private recalculateGrades(evaluationComponent: any, evaluationComponentOldName: string) {
    for (let i = 0; i < this.semester.students.length; i++) {
      let grade = this.semester.students[i].grades.find(g => g.name === evaluationComponentOldName);
      if (grade) {
        grade.name = evaluationComponent.name;
        grade.percentage = evaluationComponent.percentage;
        this.calculateStudentFinalGrade(this.semester.students[i]);
      }
    }
  }

  private calculateStudentFinalGrade(student: any) {
    let sum = 0;
    for (let i = 0; i < student.grades.length; i++) {
      sum += student.grades[i].grade * student.grades[i].percentage / 100;
    }
    student.finalGrade = Math.round(sum);
  }

  private loadClass(id: string) {
    this.http.get('class/' + id).subscribe(
      (data: any) => {
        this.loadStudents(); // load students after loading the class, need the evaluationComponents (values) to render properly
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

  private loadStudents() {
    this.http.get('student').subscribe(
      (data: any) => {
        this.semester.students = [];
        const evaluationComponents = this.semester.evaluationComponents;
        for (let i = 0; i < data.length; i++) {
          let student = data[i];
          student.grades = [];
          let studentIsGraded = false;
          // add grades
          for (let j = 0; j < evaluationComponents.length; j++) {
            const evaluationComponent = evaluationComponents[j];
            const grade = evaluationComponent.values.find(v => v.student === student.id);
            if (grade) {
              student.grades.push({
                name: evaluationComponent.name,
                grade: grade.value,
                percentage: evaluationComponent.percentage
              });
              studentIsGraded = true;
            }
          }
          if (studentIsGraded) {
            this.calculateStudentFinalGrade(student);
            this.semester.students.push(student);
          } else {
            // student is not on this class, add it to the autocomplete so that it can be added to the class
            this.studentsAutocomplete.push({
              id: student.id,
              name: student.name + " - " + student.number
            });
          }
          this.students.push(student);
        }
      },
      error => console.error(error)
    )
  }

  private updateEvaluationComponentsSum() {
    this.componentEvaluationSum = parseInt(this.semester.evaluationComponents.map(e => e.percentage).reduce((a, b) => a + b, 0));
  }
}

