import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/models/goal';
import { CalendarMonthChangeEvent, CalendarYearChangeEvent } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [
    new Goal('Learn TypeScript', 'Complete the TypeScript course on Udemy', 80, 'blue', 'pi pi-graduation-cap', '01/11/2024', 1),
    new Goal('Read Books', 'Read 12 books this year  at least please', 50, 'orange', 'pi pi-book', '01/11/2024', 3),
    new Goal('Get Fit', 'Exercise at least 4 times a week', 20, 'red', 'pi pi-gym', '01/11/2024', 4),
    new Goal('Travel', 'Visit 3 new countries this year', 30, 'purple', 'pi pi-plane', '01/11/2024', 5),
    new Goal('Learn Love', 'Complete the TypeScript course on Udemy', 40, 'blue', 'pi pi-love', '01/11/2024', 1)
  ];
  visibleGoals: Goal[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 4;
  selectedDate: Date = new Date();  
  data: any;
  options: any;
  colors: string[] = ['#7f522e', '#b37a3a'];

  constructor() { 
    this.visibleGoals = this.goals.slice(0, 4);
  }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: this.goals.map(goal => goal.title),
      datasets: [
          {
              label: 'Progress',
              backgroundColor: this.goals.map(goal => goal.color),
              borderColor: this.goals.map(goal => goal.color), 
              data: this.goals.map(goal => goal.progress)
          }
      ]
    };

    this.options = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              max: 100,
              ticks: {
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
    };
  }

  addNewGoal(): void {
    console.log('Adding new goal');
  }

  progressWidth(progress: number) {
    return progress / this.goals.length;
  }

  onMonthChange(event: CalendarMonthChangeEvent): void {
    const month = event.month;
    const year = event.year;

    if (month !== undefined && year !== undefined) {
      this.setLastDayOfMonth(month, year);
    }
  }

  onYearChange(event: CalendarYearChangeEvent): void {
    const year = event.year;

    if (year !== undefined) {
      this.setLastDayOfMonth(this.selectedDate.getMonth() + 1, year);
    }
  }

  setLastDayOfMonth(month: number, year: number): void {
    this.selectedDate = new Date(year, month, 0);
  }

  
  updateVisibleCategories(): void {
    this.visibleGoals = this.goals.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentIndex + this.itemsPerPage < this.goals.length) {
      this.currentIndex++;
      this.updateVisibleCategories();
    }
  }

  prevPage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleCategories();
    }
  }

}