import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.html',
})
export class Overview {
  dailyProgressData = [
    { day: 'T2', height: 40 },
    { day: 'T3', height: 60 },
    { day: 'T4', height: 50 },
    { day: 'T5', height: 90, isCurrent: true },
    { day: 'T6', height: 70 },
    { day: 'T7', height: 30 },
    { day: 'CN', height: 45 },
    { day: 'T2', height: 55 },
    { day: 'T3', height: 65 },
    { day: 'T4', height: 60 },
  ];

  correctVsIncorrectData = [
    { day: 'Thứ 2', correct: 60, incorrect: 15 },
    { day: 'Thứ 3', correct: 75, incorrect: 5 },
    { day: 'Thứ 4', correct: 55, incorrect: 15 },
    { day: 'Hôm nay', correct: 85, incorrect: 5, isToday: true },
  ];
}
