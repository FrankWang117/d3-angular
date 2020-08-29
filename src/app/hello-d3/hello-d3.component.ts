import { Component, OnInit } from '@angular/core';
import { select } from 'd3';

@Component({
  selector: 'app-hello-d3',
  templateUrl: './hello-d3.component.html',
  styleUrls: ['./hello-d3.component.scss'],
})
export class HelloD3Component implements OnInit {
  public sliderValue = 23;

  constructor() {}

  ngOnInit(): void {
    select('.hello').append('h2').text('Hello D3.js');
    const h2 = document.createElement('h2');
    h2.innerText = 'Hello D3.js';
    document.querySelector('.hello').appendChild(h2);
  }
}
