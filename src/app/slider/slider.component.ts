import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable, Subscription, fromEvent, from } from 'rxjs';
import {
  tap,
  map,
  pluck,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators';
import { clamp, getDecimals, valueMustBeValid } from './util';

@Component({
  selector: 'app-slider',
  styleUrls: ['./slider.component.scss'],
  template: `
    <div
      class="slider-container"
      [ngClass]="{
        'slider-vertical': thyVertical,
        'slider-disabled': thyDisabled
      }"
      #slider
    >
      <div class="rail" #sliderRail>
        <div class="track" #sliderTrack></div>
        <div class="pointer" #sliderPointer></div>
      </div>
    </div>
    <p style="margin-top:10px;">This value is {{ value }}</p>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
  private dragStartListener: Observable<number>;
  private dragMoveListener: Observable<number>;
  private dragEndListener: Observable<Event>;
  private dragStartHandler: Subscription | null;
  private dragMoveHandler: Subscription | null;
  private dragEndHandler: Subscription | null;

  public value: number;

  @ViewChild('slider', { static: true }) slider: ElementRef;

  @ViewChild('sliderRail', { static: true }) sliderRail: ElementRef;

  @ViewChild('sliderTrack', { static: true }) sliderTrack: ElementRef;

  @ViewChild('sliderPointer', { static: true }) sliderPointer: ElementRef;

  @Input() thyMax = 100;

  @Input() thyMin = 0;

  @Input() thyStep = 1;

  @Input() thyDisabled = false;

  @Input() thyVertical = false;

  @Output() thyDragEnded = new EventEmitter<{ progress: number }>();

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(newValue: number) {
    this.setValue(this.ensureValueInRange(newValue));
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this.checkRangeValues();
    this.checkStepValue();
    this.toggleDisabled();
    if (this.value === null) {
      this.setValue(this.ensureValueInRange(null));
    }
  }

  private onChangeCallback = (v: any) => {};

  private onTouchedCallback = (v: any) => {};

  checkRangeValues() {
    if (this.thyMin >= this.thyMax) {
      throw new Error('min value must less then max value.');
    }
  }

  checkStepValue() {
    if (this.thyStep <= 0 || !!!this.thyStep) {
      throw new Error('step value must be greater than 0.');
    } else if ((this.thyMax - this.thyMin) % this.thyStep) {
      throw new Error('(max - min) must be divisible by step.');
    }
  }

  toggleDisabled() {
    if (this.thyDisabled) {
      this.unsubscribeMouseActions();
    } else {
      this.subscribeMouseActions(['start']);
    }
  }

  setValue(value: number) {
    if (this.value !== value) {
      this.value = value;
      this.updateTrackAndPointer();
    }
    this.onChangeCallback(this.value);
  }

  private ensureValueInRange(value: number | number): number {
    let safeValue: number;
    if (!valueMustBeValid(value)) {
      safeValue = this.thyMin;
    } else {
      safeValue = clamp(this.thyMin, value as number, this.thyMax);
    }
    return safeValue;
  }

  private updateTrackAndPointer() {
    const offset = this.valueToOffset(this.value);
    this.updateStyle(offset / 100);
    this.cdr.markForCheck();
  }

  private valueToOffset(value: number): number {
    return ((value - this.thyMin) * 100) / (this.thyMax - this.thyMin);
  }

  private updateStyle(offsetPercentage: number) {
    const percentage = Math.min(1, Math.max(0, offsetPercentage));
    const orientFields: string[] = this.thyVertical
      ? ['height', 'top']
      : ['width', 'left'];
    this.sliderTrack.nativeElement.style[orientFields[0]] = `${
      percentage * 100
    }%`;
    this.sliderPointer.nativeElement.style[orientFields[1]] = `${
      percentage * 100
    }%`;
  }

  private unsubscribeMouseActions(
    actions: string[] = ['start', 'move', 'end']
  ) {
    if (actions.includes('start') && this.dragStartHandler) {
      this.dragStartHandler.unsubscribe();
      this.dragStartHandler = null;
    }
    if (actions.includes('move') && this.dragMoveHandler) {
      this.dragMoveHandler.unsubscribe();
      this.dragMoveHandler = null;
    }
    if (actions.includes('end') && this.dragEndHandler) {
      this.dragEndHandler.unsubscribe();
      this.dragEndHandler = null;
    }
  }

  private subscribeMouseActions(actions: string[] = ['start', 'move', 'end']) {
    if (
      actions.includes('start') &&
      this.dragStartListener &&
      !this.dragStartHandler
    ) {
      this.dragStartHandler = this.dragStartListener.subscribe(
        this.mouseStartMoving.bind(this)
      );
    }

    if (
      actions.includes('move') &&
      this.dragMoveListener &&
      !this.dragMoveHandler
    ) {
      this.dragMoveHandler = this.dragMoveListener.subscribe(
        this.mouseMoving.bind(this)
      );
    }

    if (
      actions.includes('end') &&
      this.dragEndListener &&
      !this.dragEndHandler
    ) {
      this.dragEndHandler = this.dragEndListener.subscribe(
        this.mouseStopMoving.bind(this)
      );
    }
  }

  private mouseStartMoving(value: number) {
    this.pointerController(true);
    this.setValue(value);
  }

  private mouseMoving(value: number) {
    this.setValue(value);
    this.cdr.markForCheck();
  }

  private mouseStopMoving(): void {
    this.pointerController(false);
    this.cdr.markForCheck();
    this.thyDragEnded.emit({ progress: this.value });
  }

  private pointerController(movable: boolean) {
    if (movable) {
      this.subscribeMouseActions(['move', 'end']);
    } else {
      this.unsubscribeMouseActions(['move', 'end']);
    }
  }

  ngAfterViewInit() {
    this.registerMouseEventsListeners();
    this.toggleDisabled();
  }

  private registerMouseEventsListeners() {
    const orientField = this.thyVertical ? 'pageY' : 'pageX';

    this.dragStartListener = fromEvent(
      this.slider.nativeElement,
      'mousedown'
    ).pipe(
      tap((e: Event) => {
        e.stopPropagation();
        e.preventDefault();
      }),
      pluck<Event, number>(orientField),
      map((position: number) => this.mousePositionToAdaptiveValue(position))
    );

    this.dragEndListener = fromEvent(document, 'mouseup');
    this.dragMoveListener = fromEvent(document, 'mousemove').pipe(
      tap((e: Event) => {
        e.stopPropagation();
        e.preventDefault();
      }),
      pluck<Event, number>(orientField),
      distinctUntilChanged(),
      map((position: number) => this.mousePositionToAdaptiveValue(position)),
      distinctUntilChanged(),
      takeUntil(this.dragEndListener)
    );
  }

  private mousePositionToAdaptiveValue(position: number): number {
    const sliderStartPosition = this.getSliderPagePosition();
    const sliderLength = this.getRailLength();
    const ratio = this.convertPointerPositionToRatio(
      position,
      sliderStartPosition,
      sliderLength
    );
    const value = this.ratioToValue(ratio);
    return parseFloat(value.toFixed(getDecimals(this.thyStep)));
  }

  private getSliderPagePosition(): number {
    const rect = this.slider.nativeElement.getBoundingClientRect();
    const window = this.slider.nativeElement.ownerDocument.defaultView;
    const orientFields: string[] = this.thyVertical
      ? ['top', 'pageYOffset']
      : ['left', 'pageXOffset'];
    return rect[orientFields[0]] + window[orientFields[1]];
  }

  private getRailLength() {
    const orientFiled = this.thyVertical ? 'clientHeight' : 'clientWidth';

    return this.sliderRail.nativeElement[orientFiled];
  }

  private convertPointerPositionToRatio(
    pointerPosition: number,
    startPosition: number,
    totalLength: number
  ) {
    return clamp(0, (pointerPosition - startPosition) / totalLength, 1);
    // clamp function is exist;
  }

  private ratioToValue(ratio: number) {
    let value = (this.thyMax - this.thyMin) * ratio + this.thyMin;
    const step = this.thyStep;

    if (step > 0) {
      value = Math.round(value / step) * step;
    }
    return clamp(this.thyMin, value, this.thyMax);
  }

  ngOnDestroy() {
    this.unsubscribeMouseActions();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (
      changes.hasOwnProperty('thyMin') ||
      changes.hasOwnProperty('thyMax') ||
      changes.hasOwnProperty('thyStep')
    ) {
      this.checkRangeValues();
      this.checkStepValue();
    }
  }
}
