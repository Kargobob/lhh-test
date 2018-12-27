import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'spa-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {

    title = 'client';
    apiValues: string[] = [];
    failedAttempt: boolean = false;

    constructor(private http: HttpClient)
    {
    }

    ngOnInit()
    {
        this.http.get('/api/values', {responseType: 'json'})
    .subscribe((result: any) => {
       this.apiValues = result;

    });

    }

}
