import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  class: any;
  private routeSub: Subscription;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadClass(params['id']);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private loadClass(id: string) {
    this.http.get('class/' + id).subscribe(
      (data: any) => {
        console.log(data);
        this.class = data;
      },
      error => console.error(error)
    )
  }
}

