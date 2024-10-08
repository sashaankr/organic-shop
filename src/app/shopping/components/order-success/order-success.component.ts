import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css'],
})
export class OrderSuccessComponent implements OnInit {
  timeLeft: number = 5;
  timerId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown(): void {
    const countdownElem = document.getElementById('countdown');
    if (countdownElem) {
      countdownElem.innerText = `${this.timeLeft}`;
      this.timerId = setInterval(() => {
        if (this.timeLeft <= 0) {
          clearInterval(this.timerId);
          this.router.navigate(['/']);
        } else {
          this.timeLeft--;
          countdownElem.innerText = `${this.timeLeft}`;
        }
      }, 1000);
    }
  }
}
