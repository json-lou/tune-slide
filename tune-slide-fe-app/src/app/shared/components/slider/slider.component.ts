import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() min: number;
  @Input() max: number;
  @Input() showTooltip: boolean;

  value: number;
  default: number;

  constructor() { }

  ngOnInit() {
    this.value = Math.ceil((this.min + this.max) / 2);
  }

  onSliderChange(event) {
    this.value = event.target.valueAsNumber;
  }

}
