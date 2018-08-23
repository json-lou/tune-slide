import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() min: number;
  @Input() max: number;
  @Input() showTooltip: boolean;

  value: FormControl;
  tooltipValue: number;

  constructor() {
    this.value = new FormControl(25);
    this.tooltipValue = this.value.value;
  }

  ngOnInit() {
  }

  onSliderChange() {
    this.tooltipValue = this.value.value;
  }

}
