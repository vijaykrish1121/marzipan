import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-first-project';
  projectTitle='personal details'
  name='vijay';
  age='22';
  degree='B.E';
  course='CSE'
}
